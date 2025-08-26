# 📂 CSV Merge Tool

A simple Node.js utility to **merge multiple CSV files** into one, while **removing duplicates** based on the `Title` and `Phone` columns.

---

## 🚀 Features
- Merge any number of CSV files from a folder (`./data`).
- Deduplicate rows using only the `Title + Phone` columns.
- Keeps all other columns from the first occurrence.
- Outputs a clean merged CSV file: `merged_cleaned.csv`.

---

## 📦 Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/csv-merge-tool.git
   cd csv-merge-tool
2. Install dependencies:
npm install
3. Create a folder called data inside the project and place all your CSV files there:
csv-merge-tool/
├── data/
│   ├── file1.csv
│   ├── file2.csv
│   └── ...
├── merge.js
└── package.json


**Usage**

Run the script:
node merge.js

**After execution:**
A new file merged_cleaned.csv will be created in the project root.
The file will contain all merged rows, with duplicates removed (based on Title + Phone).
