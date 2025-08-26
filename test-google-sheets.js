const fs = require('fs');
const { google } = require('googleapis');
const config = require('./config');

async function testConnectivity() {
  try {
    const credentials = JSON.parse(fs.readFileSync(config.sheets.credentialsPath));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    // Attempt to get sheet metadata
    const res = await sheets.spreadsheets.get({
      spreadsheetId: config.sheets.spreadsheetId,
    });

    console.log('✅ Google Sheets API connected successfully.');
    console.log('Spreadsheet Title:', res.data.properties.title);
  } catch (error) {
    console.error('❌ Google Sheets connectivity error:', error.message);
  }
}

testConnectivity();