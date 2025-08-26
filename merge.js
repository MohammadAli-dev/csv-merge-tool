const fs = require("fs");
const path = require("path");
const os = require("os");
const Papa = require("papaparse");
const ExcelJS = require("exceljs");

// Root data folder
const dataRoot = "./data";

// Get all subfolders inside data
const subfolders = fs.readdirSync(dataRoot).filter(f =>
  fs.statSync(path.join(dataRoot, f)).isDirectory()
);

let allRows = [];
let seen = new Set();

subfolders.forEach(subfolder => {
  const folderPath = path.join(dataRoot, subfolder);

  // Read all CSV files from the subfolder
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".csv"));

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const csvData = fs.readFileSync(filePath, "utf8");

    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    parsed.data.forEach(row => {
      // Deduplication key = Title + Phone
      const key = `${row.Title || ""}::${row.Phone || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        // Add LeadType column from folder name
        row.LeadType = subfolder;
        allRows.push(row);
      }
    });
  });
});

if (allRows.length > 0) {
  // Define preferred column order
  const preferredOrder = ["LeadType", "Title", "Phone", "Address", "Website","Google Maps Link"];

  // Collect all unique keys from rows
  const allKeys = Array.from(
    allRows.reduce((keys, row) => {
      Object.keys(row).forEach(k => keys.add(k));
      return keys;
    }, new Set())
  );

  // Build final header order = preferredOrder first, then remaining
  const finalOrder = [
    ...preferredOrder,
    ...allKeys.filter(k => !preferredOrder.includes(k))
  ];

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Leads");

  // Add header row
  worksheet.addRow(finalOrder);

  // Add data rows
  allRows.forEach(row => {
    worksheet.addRow(finalOrder.map(col => row[col] || ""));
  });

  // Set fixed column widths (~3.5 cm ≈ 13 characters in Excel)
  finalOrder.forEach((_, i) => {
    worksheet.getColumn(i + 1).width = 13;
  });

  // Save file to Desktop
  const desktopPath = path.join(os.homedir(), "Desktop");
  const outputFile = path.join(desktopPath, "Leads-Merged.xlsx");

  workbook.xlsx.writeFile(outputFile).then(() => {
    console.log(`✅ Excel file created: ${outputFile}`);
  });

} else {
  console.log("⚠️ No CSV files found in any subfolder.");
}
