#!/bin/bash

# Define the root node
ROOT_NODE="angkasapuri"

# Define the API endpoint
API_ENDPOINT="http://localhost:8000/api/directories/${ROOT_NODE}"

# Define the JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
    "type": "spreadsheet",
    "sheets": [
        {
            "data": [
                {
                    "C": "Category 1",
                    "B": "Photo URL 1",
                    "D": "Occupation 1",
                    "E": "email1@example.com",
                    "F": "123-456-7890",
                    "G": "Address 1",
                    "I": "facebook1",
                    "J": "instagram1",
                    "K": "twitter1"
                },
                {
                    "C": "Category 2",
                    "B": "Photo URL 2",
                    "D": "Occupation 2",
                    "E": "email2@example.com",
                    "F": "987-654-3210",
                    "G": "Address 2",
                    "I": "facebook2",
                    "J": "instagram2",
                    "K": "twitter2"
                }
            ]
        }
    ]
}
EOF
)

# Send the POST request using curl
curl -X POST $API_ENDPOINT \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD"

# Print a newline for better readability
echo
