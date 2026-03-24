/**
 * Utility script to convert CSV sample data to Excel files for bulk upload
 * This script generates .xlsx files from the CSV data that can be imported via the Bulk Upload Modal
 * 
 * Usage: node tools/sample-data/generateExcelFiles.js
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function csvToExcel() {
  try {
    console.log('📊 Converting CSV sample data to Excel files...\n');

    // Clients data
    console.log('Converting clients data...');
    const clientsCSV = await fs.readFile(path.join(__dirname, 'clients_50.csv'), 'utf-8');
    const clientsData = parseCSV(clientsCSV);
    const clientsWorkbook = XLSX.utils.book_new();
    const clientsSheet = XLSX.utils.json_to_sheet(clientsData);
    XLSX.utils.book_append_sheet(clientsWorkbook, clientsSheet, 'Clients');
    XLSX.writeFile(clientsWorkbook, path.join(__dirname, 'Clients_50.xlsx'));
    console.log('✅ Generated: Clients_50.xlsx');

    // Items data
    console.log('Converting items data...');
    const itemsCSV = await fs.readFile(path.join(__dirname, 'items_50.csv'), 'utf-8');
    const itemsData = parseCSV(itemsCSV);
    const itemsWorkbook = XLSX.utils.book_new();
    const itemsSheet = XLSX.utils.json_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(itemsWorkbook, itemsSheet, 'Items');
    XLSX.writeFile(itemsWorkbook, path.join(__dirname, 'Items_50.xlsx'));
    console.log('✅ Generated: Items_50.xlsx');

    console.log('\n✨ Successfully generated Excel files!');
    console.log('📁 Files location: tools/sample-data/');
    console.log('\n📋 Next steps:');
    console.log('1. Open Billety application');
    console.log('2. Go to Clients section → Click "Bulk Upload"');
    console.log('3. Select "Clients_50.xlsx"');
    console.log('4. Repeat for Items with "Items_50.xlsx"');
  } catch (error) {
    console.error('❌ Error converting CSV to Excel:', error);
    process.exit(1);
  }
}

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const row = {};
    const values = parseCSVLine(line);

    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Convert numeric strings to numbers
      if (header.includes('Rate') || header === 'Receivables') {
        value = parseFloat(value) || 0;
      }

      row[header] = value;
    });

    data.push(row);
  }

  return data;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

csvToExcel();
