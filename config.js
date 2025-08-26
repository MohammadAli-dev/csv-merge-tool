// Configuration file for CSV Merge Tool
module.exports = {
  // Default mode: 'excel' or 'sheets'
  defaultMode: 'excel',

  // Excel settings
  excel: {
    outputPath: 'Desktop', // 'Desktop' for user's desktop, or custom path
    fileName: 'Leads-Merged.xlsx',
    worksheetName: 'Leads'
  },

  // Google Sheets settings
  sheets: {
    // Replace with your Google Sheet ID (from the URL)
    spreadsheetId: '1gAsFLHqg37SJ225XEm_2d2QCwbtofo5J4cbGO3dFZ4w',
    worksheetName: 'Lucknow',

    // Google Service Account credentials file path
    credentialsPath: './credentials.json',

    // Range to start writing data (if sheet is empty)
    startRange: 'A1'
  },

  // CSV processing settings
  csv: {
    dataFolder: './data',
    preferredColumnOrder: [
      'LeadType', 'Title', 'Phone', 'Address', 'Website', 'Google Maps Link'
    ],
    columnWidth: 13 // For Excel export
  }
};