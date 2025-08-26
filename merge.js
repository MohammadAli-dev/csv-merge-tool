const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// Folder where CSV files are kept
const folderPath = "./data";

// Read all CSV files
const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".csv"));

let allRows = [];
let seen = new Set();

files.forEach(file => {
  const filePath = path.join(folderPath, file);
  const csvData = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

  parsed.data.forEach(row => {
    // Make a deduplication key using Title + Phone only
    const key = `${row.Title || ""}::${row.Phone || ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      allRows.push(row);
    }
  });
});

// Convert back to CSV
const csvOutput = Papa.unparse(allRows);
fs.writeFileSync("merged_cleaned.csv", csvOutput);

console.log("✅ Merged file created: merged_cleaned.csv");