# 🔧 Google Sheets Setup Guide

Follow these steps to enable Google Sheets integration:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## 2. Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `csv-merge-service`
   - Description: `Service account for CSV merge tool`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

## 3. Generate Credentials Key

1. Find your service account in the list
2. Click the email address to open details
3. Go to "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Click "Create" - this downloads the credentials file

## 4. Setup Credentials File

1. Rename the downloaded file to `credentials.json`
2. Place it in your project root directory
3. The file should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "csv-merge-service@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

## 5. Create and Share Google Sheet

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part
3. Share the sheet with your service account:
   - Click "Share" button
   - Add the service account email (from credentials.json)
   - Give "Editor" permissions

## 6. Update Configuration

1. Open `config.js`
2. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
3. Adjust other settings as needed

## 7. Test the Setup

Run the tool in Google Sheets mode:
```bash
npm run merge:sheets
```

Or let it auto-detect:
```bash
npm run merge
```

## 🔒 Security Notes

- Keep `credentials.json` secure and never commit it to version control
- The credentials file is already included in `.gitignore`
- Consider using environment variables for production deployments

## 🛠️ Troubleshooting

### "Error: The caller does not have permission"
- Make sure you've shared the Google Sheet with the service account email

### "Error: Requested entity was not found"
- Check if the Sheet ID is correct in `config.js`
- Make sure the worksheet name matches (default: "Leads")

### "Authentication failed"
- Verify the `credentials.json` file is in the correct location
- Check if the Google Sheets API is enabled in your project
