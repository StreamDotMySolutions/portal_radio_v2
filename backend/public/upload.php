<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
</head>
<body>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $targetDir = "uploads/"; // Specify the target directory for file uploads
    $targetFile = $targetDir . basename($_FILES["file_upload"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));


   // If everything is ok, try to upload file
	if (move_uploaded_file($_FILES["file_upload"]["tmp_name"], $targetFile)) {
		echo "The file " . htmlspecialchars(basename($_FILES["file_upload"]["name"])) . " has been uploaded.";
	} else {
		echo "Sorry, there was an error uploading your file.";
	}
}
?>

<form action="" method="post" enctype="multipart/form-data">
    <label for="file_upload">Select File:</label>
    <input type="file" name="file_upload" id="file_upload" required>
    <br>
    <input type="submit" value="Upload File">
</form>

</body>
</html>