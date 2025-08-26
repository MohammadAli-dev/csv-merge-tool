# 📂 CSV Merge Tool (Excel & Google Sheets)

A Node.js utility to **merge multiple CSV files** into a single Excel file (`.xlsx`) or Google Sheets with intelligent mode switching.  
It automatically adds a **LeadType column** based on the folder name, deduplicates records, and works both online and offline.

---

## 🚀 Features

### Core Features
- ✅ Merge CSVs from multiple subfolders inside the `data/` directory
- ✅ Deduplicate rows using `Title + Phone` combination
- ✅ Add **LeadType** column based on subfolder name
- ✅ Preserve existing data and only add new records
- ✅ Configurable column ordering and formatting

### Export Options
- **🖥️ Excel Mode**: Export to local `.xlsx` file (works offline)
- **🌐 Google Sheets Mode**: Export to shared Google Sheets (requires internet)
- **🔄 Auto Mode**: Automatically detects best mode based on connectivity and setup

### Smart Mode Detection
- **Online + Google Sheets configured** → Uses Google Sheets
- **Offline or no Google Sheets setup** → Uses Excel export

---

## 📦 Setup

```bash
# Install dependencies
npm install

# Install new dependencies for Google Sheets
npm install googleapis yargs
```

### Folder Structure
```
csv-merge-tool/
├── data/
│   ├── Architects/
│   │   ├── file1.csv
│   │   ├── file2.csv
│   ├── Builders/
│   │   ├── file3.csv
│   │   ├── file4.csv
├── merge.js
├── config.js
├── credentials.json (for Google Sheets - not in repo)
├── package.json
└── README.md
```

---

## ⚙️ Configuration

Edit `config.js` to customize settings:

```javascript
module.exports = {
  // Default mode: 'excel', 'sheets', or 'auto'
  defaultMode: 'auto',

  excel: {
    outputPath: 'Desktop',
    fileName: 'Leads-Merged.xlsx'
  },

  sheets: {
    spreadsheetId: 'YOUR_GOOGLE_SHEET_ID_HERE',
    worksheetName: 'Leads'
  }
};
```

---

## ▶️ Usage

### Quick Start (Auto Mode)
```bash
# Automatically chooses best mode
node merge.js
# or
npm run merge
```

### Specific Modes
```bash
# Force Excel export
node merge.js --mode=excel
npm run merge:excel

# Force Google Sheets
node merge.js --mode=sheets  
npm run merge:sheets

# Auto-detect (default)
node merge.js --mode=auto
npm run merge
```

### Command Line Options
```bash
node merge.js --mode=sheets --config=./custom-config.js
```

---

## 🌐 Google Sheets Setup

For Google Sheets integration, follow the detailed setup guide:

**[📖 Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md)**

**Quick Setup:**
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account
4. Download `credentials.json`
5. Create Google Sheet and share with service account
6. Update Sheet ID in `config.js`

---

## 🔄 How It Works

### Mode Detection Logic
```
Auto Mode Decision Tree:
├── Google Sheets configured? 
│   ├── Yes → Internet available?
│   │   ├── Yes → 🌐 Google Sheets Mode
│   │   └── No → 🖥️ Excel Mode  
│   └── No → 🖥️ Excel Mode
```

### Data Processing Flow
1. **Load Existing Data** (from Excel file or Google Sheets)
2. **Process CSV Files** (from all subfolders)
3. **Deduplicate Records** (based on Title + Phone)
4. **Export Data** (to chosen destination)
5. **Show Statistics** (total vs new records)

---

## 📊 Example Output

### First Run
```
🚀 Starting CSV merge in AUTO mode...
🌐 Auto-detected: Online with Google Sheets config - Using Google Sheets mode
🔐 Initializing Google Sheets authentication...
✅ Google Sheets authentication successful
📄 Google Sheet is empty or has no data rows.
✅ Google Sheets updated successfully
🔗 View at: https://docs.google.com/spreadsheets/d/your-sheet-id
📊 Total records: 150
🆕 New records added: 150
```

### Subsequent Runs
```
🚀 Starting CSV merge in SHEETS mode...
📖 Loading existing Google Sheets data...
✅ Loaded 150 existing records from Google Sheets
✅ Google Sheets updated successfully
📊 Total records: 167
🆕 New records added: 17
```

### Offline Mode
```
🚀 Starting CSV merge in AUTO mode...
💻 Auto-detected: Offline or no Google Sheets config - Using Excel mode
📖 Loading existing Excel file...
✅ Loaded 150 existing records from Excel
✅ Excel file updated: /Users/username/Desktop/Leads-Merged.xlsx
📊 Total records: 167
🆕 New records added: 17
```

---

## 🛠️ Advanced Configuration

### Custom Column Order
```javascript
// config.js
csv: {
  preferredColumnOrder: [
    'LeadType', 'Title', 'Phone', 'Address', 'Website', 'Custom Field'
  ]
}
```

### Multiple Google Sheets
```javascript
// Different configs for different projects
sheets: {
  spreadsheetId: process.env.GOOGLE_SHEET_ID || 'default-sheet-id',
  worksheetName: process.env.WORKSHEET_NAME || 'Leads'
}
```

---

## 🔐 Security & Privacy

- ✅ `credentials.json` is automatically excluded from version control
- ✅ All data processing happens locally
- ✅ Google Sheets API uses secure OAuth2 authentication
- ✅ No data is stored on external servers

---

## 🚨 Troubleshooting

### Google Sheets Issues
```bash
# Test Google Sheets connectivity
node -e "console.log('Testing...'); require('./merge.js')" --mode=sheets
```

### Common Problems
- **"Authentication failed"** → Check `credentials.json` file
- **"Permission denied"** → Share sheet with service account email
- **"Sheet not found"** → Verify Sheet ID in `config.js`

---

## 📈 What's New in v2.0

- 🌐 **Google Sheets Integration**
- 🔄 **Auto Mode Detection** 
- ⚙️ **Configurable Settings**
- 🎯 **Command Line Options**
- 📊 **Enhanced Logging**
- 🔒 **Better Error Handling**
- 📖 **Comprehensive Documentation**

---

## 🤝 Migration from v1.0

Your existing setup will work without changes:
- Old `merge.js` behavior preserved in Excel mode
- Configuration is optional (uses sensible defaults)
- No breaking changes to existing functionality

---

## 📞 Support

- 📖 Read the [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md)
- 🐛 Check troubleshooting section above
- 💡 Review the example configurations

---

*Perfect for lead management, data consolidation, and automated reporting workflows!* 🎯
