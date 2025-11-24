#!/usr/bin/env node

/**
 * Script to sync benchmarks.csv from Google Sheets
 * Usage: npm run sync:benchmarks
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SHEET_ID = '1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ';
const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const OUTPUT_PATH = path.join(__dirname, '../data/benchmarks.csv');
const BACKUP_PATH = path.join(__dirname, '../data/benchmarks.csv.backup');

/**
 * Download CSV from Google Sheets
 */
function downloadCSV(url) {
  return new Promise((resolve, reject) => {
    console.log('📥 Downloading CSV from Google Sheets...');
    console.log(`   URL: ${url.substring(0, 80)}...`);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log('🔄 Following redirect...');
        return https.get(response.headers.location, (redirectResponse) => {
          handleResponse(redirectResponse, resolve, reject);
        }).on('error', reject);
      }

      handleResponse(response, resolve, reject);
    }).on('error', reject);
  });
}

function handleResponse(response, resolve, reject) {
  // Handle all redirect codes
  if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
    const redirectUrl = response.headers.location;
    console.log(`🔄 Following redirect (${response.statusCode}) to: ${redirectUrl.substring(0, 60)}...`);

    return https.get(redirectUrl, (redirectResponse) => {
      handleResponse(redirectResponse, resolve, reject);
    }).on('error', reject);
  }

  if (response.statusCode !== 200) {
    return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
  }

  let data = '';
  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    if (!data || data.trim().length === 0) {
      return reject(new Error('Downloaded CSV is empty'));
    }

    console.log(`✅ Downloaded ${data.length} bytes`);
    resolve(data);
  });
}

/**
 * Backup current CSV
 */
function backupCurrentCSV() {
  if (fs.existsSync(OUTPUT_PATH)) {
    console.log('💾 Creating backup of current CSV...');
    fs.copyFileSync(OUTPUT_PATH, BACKUP_PATH);
    console.log(`✅ Backup saved to ${BACKUP_PATH}`);
  }
}

/**
 * Write CSV to file
 */
function writeCSV(data) {
  console.log('💾 Writing CSV to file...');
  fs.writeFileSync(OUTPUT_PATH, data, 'utf-8');
  console.log(`✅ CSV saved to ${OUTPUT_PATH}`);
}

/**
 * Validate and generate TypeScript
 */
function generateTypeScript() {
  console.log('\n⚙️  Validating and generating TypeScript...');

  try {
    execSync('node scripts/generate-benchmarks.js', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ TypeScript generated successfully');
    return true;
  } catch (error) {
    console.error('❌ Validation/generation failed');
    console.error('   Restoring backup...');

    if (fs.existsSync(BACKUP_PATH)) {
      fs.copyFileSync(BACKUP_PATH, OUTPUT_PATH);
      console.log('✅ Backup restored');
    }

    throw error;
  }
}

/**
 * Show diff between old and new
 */
function showDiff() {
  if (!fs.existsSync(BACKUP_PATH)) {
    console.log('\nℹ️  No previous version to compare');
    return;
  }

  console.log('\n📊 Changes detected:');

  try {
    const diff = execSync(`git diff --no-index --color=always ${BACKUP_PATH} ${OUTPUT_PATH}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    if (diff.trim()) {
      console.log(diff);
    } else {
      console.log('   No changes (files are identical)');
    }
  } catch (error) {
    // git diff returns exit code 1 when files differ
    if (error.stdout) {
      console.log(error.stdout);
    }
  }
}

/**
 * Cleanup backup
 */
function cleanup() {
  if (fs.existsSync(BACKUP_PATH)) {
    fs.unlinkSync(BACKUP_PATH);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     📊 SYNC BENCHMARKS FROM GOOGLE SHEETS                 ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // Step 1: Backup
    backupCurrentCSV();

    // Step 2: Download
    const csvData = await downloadCSV(EXPORT_URL);

    // Step 3: Write
    writeCSV(csvData);

    // Step 4: Validate & Generate
    generateTypeScript();

    // Step 5: Show diff
    showDiff();

    // Step 6: Cleanup
    cleanup();

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║     ✅ SYNC COMPLETED SUCCESSFULLY                        ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📝 Next steps:');
    console.log('   1. Review the changes above');
    console.log('   2. Test your application: npm run dev');
    console.log('   3. Commit the changes:');
    console.log('      git add data/');
    console.log('      git commit -m "chore: Sync benchmarks from Google Sheets"');
    console.log('      git push\n');

  } catch (error) {
    console.error('\n╔═══════════════════════════════════════════════════════════╗');
    console.error('║                                                           ║');
    console.error('║     ❌ SYNC FAILED                                        ║');
    console.error('║                                                           ║');
    console.error('╚═══════════════════════════════════════════════════════════╝\n');
    console.error('Error:', error.message);
    console.error('\nPossible causes:');
    console.error('  - Google Sheet is not publicly accessible');
    console.error('  - Invalid SHEET_ID');
    console.error('  - Network connectivity issues');
    console.error('  - CSV validation failed (check low < median < high)\n');

    process.exit(1);
  }
}

main();
