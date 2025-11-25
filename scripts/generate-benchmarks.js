#!/usr/bin/env node

/**
 * Script to convert benchmarks.csv to benchmarks.ts
 * Usage: node scripts/generate-benchmarks.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const CSV_PATH = path.join(__dirname, '../data/benchmarks.csv');
const OUTPUT_PATH = path.join(__dirname, '../data/benchmarks.ts');

/**
 * Parse CSV line handling commas and special characters
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

/**
 * Parse CSV file into structured data
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line, idx) => {
    const values = parseCSVLine(line);

    if (values.length !== headers.length) {
      console.warn(`⚠️  Warning: Line ${idx + 2} has ${values.length} values but expected ${headers.length}`);
    }

    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });

    return row;
  });
}

/**
 * Validate that low < median < high
 */
function validateRow(row, lineNumber) {
  const low = parseFloat(row.low);
  const median = parseFloat(row.median);
  const high = parseFloat(row.high);

  if (isNaN(low) || isNaN(median) || isNaN(high)) {
    throw new Error(`Line ${lineNumber}: Invalid numeric values - low: ${row.low}, median: ${row.median}, high: ${row.high}`);
  }

  if (low >= median) {
    throw new Error(`Line ${lineNumber}: Validation failed for ${row.industry} ${row.price_tier} ${row.metric_id} - low (${low}) must be < median (${median})`);
  }

  if (median >= high) {
    throw new Error(`Line ${lineNumber}: Validation failed for ${row.industry} ${row.price_tier} ${row.metric_id} - median (${median}) must be < high (${high})`);
  }

  return true;
}

/**
 * Group data by industry and metric
 */
function groupData(rows) {
  const grouped = {};

  rows.forEach((row, index) => {
    try {
      validateRow(row, index + 2); // +2 because of header and 0-index
    } catch (error) {
      console.error(`❌ ${error.message}`);
      process.exit(1);
    }

    if (!grouped[row.industry]) {
      grouped[row.industry] = {};
    }

    if (!grouped[row.industry][row.metric_id]) {
      grouped[row.industry][row.metric_id] = {
        id: row.metric_id,
        category: row.category,
        name: row.name,
        unit: row.unit,
        description: row.description,
        ranges: {}
      };
    }

    grouped[row.industry][row.metric_id].ranges[row.price_tier] = {
      low: parseFloat(row.low),
      median: parseFloat(row.median),
      high: parseFloat(row.high),
      insight: row.insight
    };
  });

  return grouped;
}

/**
 * Generate TypeScript code
 */
function generateTypeScript(groupedData) {
  const industries = Object.keys(groupedData).sort();
  const industryType = industries.map(i => `'${i}'`).join(' | ');

  let ts = `// Auto-generated from benchmarks.csv
// DO NOT EDIT MANUALLY - Run 'npm run generate:benchmarks' to update

export type Industry = ${industryType};
export type PriceTier = 'Budget' | 'Mid-Range' | 'Luxury';

export interface BenchmarkData {
    id: string;
    category: 'Strategic Efficiency' | 'Acquisition' | 'Conversion' | 'Channel Mix' | 'Retention' | 'Economics';
    name: string;
    unit: string;
    description: string;
    ranges: {
        [key in PriceTier]: {
            low: number;
            median: number;
            high: number;
            insight: string;
        };
    };
}

export const benchmarks: Record<Industry, BenchmarkData[]> = {\n`;

  industries.forEach((industry, idx) => {
    ts += `    ${industry}: [\n`;

    const metrics = Object.values(groupedData[industry]);

    metrics.forEach((metric, metricIdx) => {
      ts += `        {\n`;
      ts += `            id: '${metric.id || ''}',\n`;
      ts += `            category: '${metric.category || ''}',\n`;
      ts += `            name: '${metric.name || ''}',\n`;
      ts += `            unit: '${metric.unit || ''}',\n`;
      ts += `            description: '${(metric.description || '').replace(/'/g, "\\'")}',\n`;
      ts += `            ranges: {\n`;

      ['Budget', 'Mid-Range', 'Luxury'].forEach(tier => {
        if (metric.ranges[tier]) {
          const range = metric.ranges[tier];
          ts += `                '${tier}': { low: ${range.low}, median: ${range.median}, high: ${range.high}, insight: '${(range.insight || '').replace(/'/g, "\\'")}' },\n`;
        }
      });

      ts += `            },\n`;
      ts += `        }${metricIdx < metrics.length - 1 ? ',' : ''}\n`;
    });

    ts += `    ]${idx < industries.length - 1 ? ',' : ''}\n`;
  });

  ts += `};\n`;

  return ts;
}

/**
 * Main function
 */
function main() {
  try {
    console.log('📊 Generating benchmarks from CSV...\n');

    // Parse CSV
    console.log('📖 Reading CSV file...');
    const rows = parseCSV(CSV_PATH);
    console.log(`✅ Parsed ${rows.length} rows\n`);

    // Group by industry
    console.log('🔄 Grouping data by industry...');
    const grouped = groupData(rows);
    const industries = Object.keys(grouped);
    console.log(`✅ Found ${industries.length} industries: ${industries.join(', ')}\n`);

    // Validate all data
    console.log('✔️  Validating all data (low < median < high)...');
    let totalMetrics = 0;
    industries.forEach(industry => {
      totalMetrics += Object.keys(grouped[industry]).length;
    });
    console.log(`✅ Validated ${totalMetrics} metrics across all tiers\n`);

    // Generate TypeScript
    console.log('⚙️  Generating TypeScript...');
    const tsCode = generateTypeScript(grouped);

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, tsCode, 'utf-8');
    console.log(`✅ Generated ${OUTPUT_PATH}\n`);

    console.log('🎉 Done! Your benchmarks are ready to use.\n');
    console.log('📝 Summary:');
    industries.forEach(industry => {
      const metrics = Object.keys(grouped[industry]).length;
      console.log(`   - ${industry}: ${metrics} metrics × 3 tiers = ${metrics * 3} data points`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
