<?php
/**
 * Google Drive/Sheets PHP Processor
 * Converts GAS script to PHP for accessing Google Drive and Sheets
 * 
 * Save this file as: drive_processor.php
 */

require_once 'vendor/autoload.php';

use Google\Client;
use Google\Service\Drive;
use Google\Service\Sheets;

class GoogleDriveSheetProcessor {
    private $client;
    private $driveService;
    private $sheetsService;
    
    // Configuration
    private $rootFolderId = "1NQkG43NLhpI2p5O4JOKBKOzTjSaq7ji7"; // angkasapuri
    private $apiUrl = "https://portalrtm.streamdotmy.com/api/directories/01__Angkasapuri";
    
    public function __construct($credentialsPath) {
        $this->initializeGoogleClient($credentialsPath);
    }
    
    private function initializeGoogleClient($credentialsPath) {
        $this->client = new Client();
        $this->client->setApplicationName('Drive Sheets Processor');
        $this->client->setScopes([
            Drive::DRIVE_READONLY,
            Sheets::SPREADSHEETS_READONLY
        ]);
        $this->client->setAuthConfig($credentialsPath);
        $this->client->setAccessType('offline');
        
        // Handle authentication token
        $tokenPath = 'token.json';
        if (file_exists($tokenPath)) {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            $this->client->setAccessToken($accessToken);
        }
        
        // If there is no previous token or it's expired
        if ($this->client->isAccessTokenExpired()) {
            // Refresh the token if possible, else get a new one
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            } else {
                // Request authorization from the user
                $authUrl = $this->client->createAuthUrl();
                printf("Open the following link in your browser:\n%s\n", $authUrl);
                print 'Enter verification code: ';
                $authCode = trim(fgets(STDIN));
                
                // Exchange authorization code for an access token
                $accessToken = $this->client->fetchAccessTokenWithAuthCode($authCode);
                $this->client->setAccessToken($accessToken);
                
                // Check to see if there was an error
                if (array_key_exists('error', $accessToken)) {
                    throw new Exception(join(', ', $accessToken));
                }
            }
            // Save the token to a file
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }
            file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
        }
        
        $this->driveService = new Drive($this->client);
        $this->sheetsService = new Sheets($this->client);
    }
    
    public function listFolders() {
        try {
            $folderStructure = $this->listContents($this->rootFolderId);
            $this->sendDataToUrl($folderStructure);
            return $folderStructure;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
            return null;
        }
    }
    
    private function listContents($folderId) {
        // Get folder information
        $folder = $this->driveService->files->get($folderId);
        
        $folderData = [
            'name' => $folder->getName(),
            'type' => 'folder',
            'children' => []
        ];
        
        // List all items in the folder
        $query = "'{$folderId}' in parents and trashed=false";
        $results = $this->driveService->files->listFiles([
            'q' => $query,
            'fields' => 'files(id,name,mimeType)'
        ]);
        
        foreach ($results->getFiles() as $file) {
            $mimeType = $file->getMimeType();
            
            if ($mimeType === 'application/vnd.google-apps.folder') {
                // Recursively process subfolders
                $subFolderData = $this->listContents($file->getId());
                $folderData['children'][] = $subFolderData;
            } elseif ($mimeType === 'application/vnd.google-apps.spreadsheet') {
                // Process Google Sheets
                $fileData = [
                    'name' => $file->getName(),
                    'type' => 'spreadsheet',
                    'sheets' => $this->listSheetNamesAndData($file->getId())
                ];
                $folderData['children'][] = $fileData;
            }
        }
        
        return $folderData;
    }
    
    private function listSheetNamesAndData($spreadsheetId) {
        try {
            $spreadsheet = $this->sheetsService->spreadsheets->get($spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            $sheetsData = [];
            
            foreach ($sheets as $sheet) {
                $sheetName = $sheet->getProperties()->getTitle();
                $data = $this->getDataFromSheet($spreadsheetId, $sheetName);
                $sheetsData[] = [
                    'name' => $sheetName,
                    'data' => $data
                ];
            }
            
            return $sheetsData;
        } catch (Exception $e) {
            echo "Error processing spreadsheet {$spreadsheetId}: " . $e->getMessage() . "\n";
            return [];
        }
    }
    
    private function getDataFromSheet($spreadsheetId, $sheetName) {
        try {
            // Get data starting from row 5, columns A to K
            $range = "{$sheetName}!A5:K";
            $response = $this->sheetsService->spreadsheets_values->get($spreadsheetId, $range);
            $values = $response->getValues();
            
            if (empty($values)) {
                return [];
            }
            
            $data = [];
            foreach ($values as $row) {
                // Check if row has any non-empty values
                if (array_filter($row, function($cell) { return !empty(trim($cell)); })) {
                    // Ensure we have at least 11 columns (A-K)
                    $row = array_pad($row, 11, '');
                    
                    $data[] = [
                        'A' => $row[0] ?? '',
                        'B' => $row[1] ?? '',
                        'C' => $row[2] ?? '',
                        'D' => $row[3] ?? '',
                        'E' => $row[4] ?? '',
                        'F' => $row[5] ?? '',
                        'G' => $row[6] ?? '',
                        'H' => $row[7] ?? '',
                        'I' => $row[8] ?? '',
                        'J' => $row[9] ?? '',
                        'K' => $row[10] ?? ''
                    ];
                }
            }
            
            return $data;
        } catch (Exception $e) {
            echo "Error getting data from sheet {$sheetName}: " . $e->getMessage() . "\n";
            return [];
        }
    }
    
    private function sendDataToUrl($data) {
        $jsonData = json_encode($data);
        
        $options = [
            'http' => [
                'header' => "Content-Type: application/json\r\n",
                'method' => 'POST',
                'content' => $jsonData
            ]
        ];
        
        $context = stream_context_create($options);
        
        try {
            $result = file_get_contents($this->apiUrl, false, $context);
            
            if ($result === FALSE) {
                echo "Error sending data to URL\n";
            } else {
                echo "Response: " . $result . "\n";
                echo "Data sent successfully\n";
            }
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
        }
    }
}

// Usage
try {
    // Initialize with your credentials file path
    $processor = new GoogleDriveSheetProcessor('path/to/your/credentials.json');
    
    // Process folders and send data
    $result = $processor->listFolders();
    
    if ($result) {
        echo "Processing completed successfully\n";
        // Optionally print the structure
        // echo json_encode($result, JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    echo "Fatal error: " . $e->getMessage() . "\n";
}
?>