#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 CSV Merge Tool - Setup Verification\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`📦 Node.js version: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 14) {
  console.log('⚠️  Warning: Node.js 14+ recommended');
} else {
  console.log('✅ Node.js version is compatible');
}

// Check dependencies
console.log('\n📚 Checking dependencies...');
const requiredPackages = ['exceljs', 'papaparse', 'googleapis', 'yargs'];
const packageJson = require('./package.json');

requiredPackages.forEach(pkg => {
  if (packageJson.dependencies && packageJson.dependencies[pkg]) {
    console.log(`✅ ${pkg}: ${packageJson.dependencies[pkg]}`);
  } else {
    console.log(`❌ ${pkg}: NOT INSTALLED`);
  }
});

// Check file structure
console.log('\n📁 Checking file structure...');
const requiredFiles = [
  { file: 'merge.js', desc: 'Main script' },
  { file: 'config.js', desc: 'Configuration file' },
  { file: 'package.json', desc: 'Package definition' }
];

requiredFiles.forEach(({ file, desc }) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - ${desc}`);
  } else {
    console.log(`❌ ${file} - ${desc} (MISSING)`);
  }
});

// Check data folder
console.log('\n📂 Checking data folder...');
if (fs.existsSync('./data')) {
  const subfolders = fs.readdirSync('./data').filter(f => 
    fs.statSync(path.join('./data', f)).isDirectory()
  );

  if (subfolders.length > 0) {
    console.log(`✅ Data folder exists with ${subfolders.length} subfolders:`);
    subfolders.forEach(folder => {
      const csvCount = fs.readdirSync(`./data/${folder}`)
        .filter(f => f.endsWith('.csv')).length;
      console.log(`   📁 ${folder}: ${csvCount} CSV files`);
    });
  } else {
    console.log('⚠️  Data folder exists but is empty');
  }
} else {
  console.log('❌ Data folder not found');
}

// Check Google Sheets setup
console.log('\n🌐 Checking Google Sheets setup...');
if (fs.existsSync('./credentials.json')) {
  try {
    const creds = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
    if (creds.type === 'service_account' && creds.client_email) {
      console.log('✅ credentials.json found and valid');
      console.log(`   📧 Service account: ${creds.client_email}`);
    } else {
      console.log('⚠️  credentials.json exists but may be invalid');
    }
  } catch (error) {
    console.log('❌ credentials.json exists but is not valid JSON');
  }
} else {
  console.log('⚠️  credentials.json not found (Excel mode only)');
}

// Check config
console.log('\n⚙️  Checking configuration...');
try {
  const config = require('./config.js');
  if (config.sheets && config.sheets.spreadsheetId !== 'YOUR_GOOGLE_SHEET_ID_HERE') {
    console.log('✅ Google Sheets ID configured');
    console.log(`   🔗 Sheet ID: ${config.sheets.spreadsheetId}`);
  } else {
    console.log('⚠️  Google Sheets ID not configured');
  }
} catch (error) {
  console.log('❌ Error reading config.js');
}

// Recommendations
console.log('\n💡 Recommendations:');
console.log('1. Run "npm install" to install missing dependencies');
console.log('2. Create ./data folder with CSV subfolders');
console.log('3. For Google Sheets: follow GOOGLE_SHEETS_SETUP.md');
console.log('4. Test with: node merge.js --mode=excel');
console.log('\n🚀 Ready to run: node merge.js');
