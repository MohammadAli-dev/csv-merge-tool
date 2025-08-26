const fs = require("fs");
const path = require("path");
const os = require("os");
const Papa = require("papaparse");
const ExcelJS = require("exceljs");
const { google } = require("googleapis");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const config = require("./config");

// Correct yargs usage with chaining
const argv = yargs(hideBin(process.argv))
  .option("mode", {
    alias: "m",
    type: "string",
    choices: ["excel", "sheets", "auto"],
    default: "auto",
    description: "Export mode: excel, sheets, or auto-detect"
  })
  .option("config", {
    alias: "c",
    type: "string",
    description: "Path to config file"
  })
  .help()
  .argv;

class CSVMerger {
  constructor() {
    this.allRows = [];
    this.seen = new Set();
    this.mode = this.detectMode();
    this.sheets = null;
  }

  detectMode() {
    if (argv.mode !== "auto") {
      return argv.mode;
    }

    // Auto-detect: Check Google Sheets config + online status
    if (this.hasGoogleSheetsConfig() && this.isOnline()) {
      console.log("🌐 Auto-detected: Online with Google Sheets config - Using Google Sheets mode");
      return "sheets";
    } else {
      console.log("💻 Auto-detected: Offline or no Google Sheets config - Using Excel mode");
      return "excel";
    }
  }

  hasGoogleSheetsConfig() {
    try {
      return (
        fs.existsSync(config.sheets.credentialsPath) &&
        config.sheets.spreadsheetId !== "YOUR_GOOGLE_SHEET_ID_HERE"
      );
    } catch {
      return false;
    }
  }

  isOnline() {
    try {
      require("dns").lookupService("8.8.8.8", 53, () => {});
      return true;
    } catch {
      return false;
    }
  }

  async initializeGoogleSheets() {
    if (this.mode !== "sheets") return;

    try {
      console.log("🔐 Initializing Google Sheets authentication...");

      const credentials = JSON.parse(fs.readFileSync(config.sheets.credentialsPath));
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
      });

      this.sheets = google.sheets({ version: "v4", auth });
      console.log("✅ Google Sheets authentication successful");
    } catch (error) {
      console.error("❌ Google Sheets authentication failed:", error.message);
      console.log("💻 Falling back to Excel mode");
      this.mode = "excel";
    }
  }

  async loadExistingData() {
    if (this.mode === "excel") {
      await this.loadExistingExcelData();
    } else if (this.mode === "sheets") {
      await this.loadExistingSheetsData();
    }
  }

  async loadExistingExcelData() {
    const outputFile = this.getExcelPath();

    if (fs.existsSync(outputFile)) {
      console.log("📖 Loading existing Excel file...");
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(outputFile);
        const worksheet = workbook.getWorksheet(config.excel.worksheetName);

        if (worksheet) {
          const headers = [];
          const headerRow = worksheet.getRow(1);
          headerRow.eachCell((cell, index) => {
            headers[index - 1] = cell.value;
          });

          worksheet.eachRow((row, rowIndex) => {
            if (rowIndex > 1) {
              const rowData = {};
              row.eachCell((cell, index) => {
                const header = headers[index - 1];
                if (header) {
                  rowData[header] = cell.value || "";
                }
              });

              const key = `${rowData.Title || ""}::${rowData.Phone || ""}`;
              if (!this.seen.has(key)) {
                this.seen.add(key);
                this.allRows.push(rowData);
              }
            }
          });

          console.log(`✅ Loaded ${this.allRows.length} existing records from Excel`);
        }
      } catch (error) {
        console.log(`⚠️ Error reading existing Excel file: ${error.message}`);
        console.log("📝 Will create a new file...");
        this.allRows = [];
        this.seen = new Set();
      }
    } else {
      console.log("📄 No existing Excel file found. Will create a new one.");
    }
  }

  async loadExistingSheetsData() {
    try {
      console.log("📖 Loading existing Google Sheets data...");

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.sheets.spreadsheetId,
        range: `${config.sheets.worksheetName}!A:Z`
      });

      const rows = response.data.values || [];

      if (rows.length > 1) {
        const headers = rows[0];

        for (let i = 1; i < rows.length; i++) {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = rows[i][index] || "";
          });

          const key = `${rowData.Title || ""}::${rowData.Phone || ""}`;
          if (!this.seen.has(key)) {
            this.seen.add(key);
            this.allRows.push(rowData);
          }
        }

        console.log(`✅ Loaded ${this.allRows.length} existing records from Google Sheets`);
      } else {
        console.log("📄 Google Sheet is empty or has no data rows.");
      }
    } catch (error) {
      console.error(`⚠️ Error reading Google Sheets: ${error.message}`);
      throw error;
    }
  }

  processCSVFiles() {
    const subfolders = fs
      .readdirSync(config.csv.dataFolder)
      .filter((f) => fs.statSync(path.join(config.csv.dataFolder, f)).isDirectory());

    let newRecordsCount = 0;

    subfolders.forEach((subfolder) => {
      const folderPath = path.join(config.csv.dataFolder, subfolder);
      const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".csv"));

      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const csvData = fs.readFileSync(filePath, "utf8");
        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

        parsed.data.forEach((row) => {
          const key = `${row.Title || ""}::${row.Phone || ""}`;

          if (!this.seen.has(key)) {
            this.seen.add(key);
            row.LeadType = subfolder;
            this.allRows.push(row);
            newRecordsCount++;
          }
        });
      });
    });

    return newRecordsCount;
  }

  getFinalColumnOrder() {
    const allKeys = Array.from(
      this.allRows.reduce((keys, row) => {
        Object.keys(row).forEach((k) => keys.add(k));
        return keys;
      }, new Set())
    );

    return [
      ...config.csv.preferredColumnOrder,
      ...allKeys.filter((k) => !config.csv.preferredColumnOrder.includes(k))
    ];
  }

  getExcelPath() {
    const desktopPath =
      config.excel.outputPath === "Desktop"
        ? path.join(os.homedir(), "Desktop")
        : config.excel.outputPath;
    return path.join(desktopPath, config.excel.fileName);
  }

  async exportToExcel(newRecordsCount) {
    const finalOrder = this.getFinalColumnOrder();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(config.excel.worksheetName);

    worksheet.addRow(finalOrder);

    this.allRows.forEach((row) => {
      worksheet.addRow(finalOrder.map((col) => row[col] || ""));
    });

    finalOrder.forEach((_, i) => {
      worksheet.getColumn(i + 1).width = config.csv.columnWidth;
    });

    const outputFile = this.getExcelPath();
    await workbook.xlsx.writeFile(outputFile);

    const fileExists = fs.existsSync(outputFile) && this.allRows.length > newRecordsCount;
    console.log(`✅ Excel file ${fileExists ? "updated" : "created"}: ${outputFile}`);
  }

  async exportToGoogleSheets(newRecordsCount) {
    const finalOrder = this.getFinalColumnOrder();

    const values = [
      finalOrder,
      ...this.allRows.map((row) => finalOrder.map((col) => row[col] || ""))
    ];

    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: config.sheets.spreadsheetId,
        range: `${config.sheets.worksheetName}!A:Z`
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: config.sheets.spreadsheetId,
        range: `${config.sheets.worksheetName}!${config.sheets.startRange}`,
        valueInputOption: "RAW",
        resource: { values }
      });

      console.log(`✅ Google Sheets updated successfully`);
      console.log(`🔗 View at: https://docs.google.com/spreadsheets/d/${config.sheets.spreadsheetId}`);
    } catch (error) {
      console.error(`❌ Error updating Google Sheets: ${error.message}`);
      throw error;
    }
  }

  async run() {
    try {
      console.log(`🚀 Starting CSV merge in ${this.mode.toUpperCase()} mode...`);

      await this.initializeGoogleSheets();

      await this.loadExistingData();

      const newRecordsCount = this.processCSVFiles();

      if (this.allRows.length > 0) {
        if (this.mode === "excel") {
          await this.exportToExcel(newRecordsCount);
        } else if (this.mode === "sheets") {
          await this.exportToGoogleSheets(newRecordsCount);
        }

        console.log(`📊 Total records: ${this.allRows.length}`);
        console.log(`🆕 New records added: ${newRecordsCount}`);

        if (newRecordsCount === 0) {
          console.log("🔄 No new records found. File unchanged.");
        }
      } else {
        console.log("⚠️ No CSV files found in any subfolder.");
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
}

const merger = new CSVMerger();
merger.run();
