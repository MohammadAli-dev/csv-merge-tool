# 📂 CSV Merge Tool (Excel Export)

A Node.js utility to **merge multiple CSV files** into a single Excel file (`.xlsx`).  
It automatically adds a **LeadType column** based on the folder name and ensures all columns have a **fixed width of 3.5 cm** for clean reporting.

---

## 🚀 Features
- Merge CSVs from multiple subfolders inside the `data/` directory.  
- Deduplicate rows using only the `Title + Phone` columns.  
- Add a new column **LeadType** (taken from the subfolder name).  
- Export a single file **`Leads-Merged.xlsx`** to your Desktop.  
- Fixed column width (≈ 13 characters = 3.5 cm).  
- Automatically keeps preferred column order:  
```

LeadType, Title, Phone, Address, Website, ...

````

---

## 📦 Setup

```bash
# Clone this repository
git clone https://github.com/<your-username>/csv-merge-tool.git
cd csv-merge-tool

# Install dependencies
npm install
````

* Create a folder named `data/` in the project root.
* Inside `data/`, create subfolders for each lead type (e.g., `Architects`, `Builders`, etc.).
* Place your CSV files inside these subfolders. Example:

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
├── package.json
└── .gitignore
```

---

## ▶️ Usage

Run the script:

```bash
node merge.js
```

Output:

* File `Leads-Merged.xlsx` will be created on your **Desktop**.
* It will contain all leads combined from all subfolders.
* Each row will include a **LeadType** column based on its subfolder.

---

## ⚖️ Example

**Input folder structure:**

```
data/
├── Architects/
│   ├── arch1.csv
│   ├── arch2.csv
├── Builders/
│   ├── build1.csv
```

**Output (Leads-Merged.xlsx):**

| LeadType   | Title    | Phone | Address  | Website | ... |
| ---------- | -------- | ----- | -------- | ------- | --- |
| Architects | ABC Corp | 12345 | New York | abc.com | ... |
| Builders   | XYZ Ltd  | 67890 | London   | xyz.com | ... |

---

## 🛠️ .gitignore

The project includes a `.gitignore` file that excludes:

* `node_modules/`
* `data/` (raw CSVs)
* Temporary/system files

---
