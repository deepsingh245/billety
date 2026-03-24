# Sample Data for Billety - Construction Company

This directory contains sample data for testing the Billety application with realistic construction company data.

## 📊 Sample Data Overview

### What's Included:
- **50 Construction Clients** - Realistic company names with contact details
- **50 Construction Items** - Categorized building materials, hardware, and equipment
- **3 Construction Sites** - Example project sites
- **Multiple formats** - CSV and Excel files for flexibility

### Data Files:

| File | Type | Records | Purpose |
|------|------|---------|---------|
| `clients_50.csv` | CSV | 50 | Import clients via bulk upload |
| `items_50.csv` | CSV | 50 | Import items via bulk upload |
| `Clients_50.xlsx` | Excel | 50 | Ready-to-use Excel for bulk upload |
| `Items_50.xlsx` | Excel | 50 | Ready-to-use Excel for bulk upload |
| `construction-sample-data.json` | JSON | All | Reference/backup data |

## 🚀 Quick Start

### Option 1: Use Pre-Generated Excel Files (Fastest)

Excel files are already generated and ready to use:

```bash
1. Open Billety application
2. Navigate to "Clients" section
3. Click "Bulk Upload" button
4. Select: tools/sample-data/Clients_50.xlsx
5. Click "Upload"

Repeat for Items:
1. Navigate to "Items" section
2. Click "Bulk Upload" button
3. Select: tools/sample-data/Items_50.xlsx
4. Click "Upload"
```

### Option 2: Generate Excel Files (If Needed)

```bash
npm run generate-sample-data
# or manually:
node tools/sample-data/generateExcelFiles.js
```

## 📝 Data Structure

### Client Data Fields:
```
Name          - Client company name
Email         - Contact email address
Phone         - Phone number
Company       - Parent company name
Receivables   - Amount customer owes (in INR)
```

**Example:**
```
ABC Construction Ltd,contact@abcconst.com,+91-9876543210,ABC Construction Group,5000
```

### Item Data Fields:
```
Name            - Item/material name
Category        - Category (Steel, Cement, Tiles, etc.)
RatePerKg       - Price per kilogram
RatePerPiece    - Price per piece/unit
Unit            - Measurement unit (kg, piece, meter, etc.)
Description     - Item description
```

**Example:**
```
Steel Bars - 12mm,Steel & Iron,55,0,kg,Mild steel bars 12mm diameter
```

### Item Categories (50 items):
- **Building Materials** - Cement, sand, gravel
- **Steel & Iron** - Bars, sheets, structural
- **Bricks & Blocks** - Clay bricks, concrete blocks
- **Aggregates** - Sand, gravel, stones
- **Hardware** - Nails, bolts, screws
- **Doors & Windows** - Frames, shutters
- **Tiles & Flooring** - Ceramic, marble, granite
- **Paints & Coatings** - Emulsion, enamel, waterproofing
- **Plumbing** - Pipes, fittings, fixtures
- **Electrical** - Wires, switches, bulbs, sockets
- **Roofing** - Sheets, tiles, gutters
- **Finishing** - Putty, adhesives, grout, polish
- **Equipment** - Ladders, scaffolding

## 📊 Sample Sites

Three example construction sites:
1. **Central Business Complex** (Commercial) - Downtown
2. **Residential Complex - Phase II** (Residential) - North District
3. **Industrial Park Development** (Industrial) - Industrial Zone

*Sites must be created manually in the application (no bulk upload feature)*

## 💾 File Formats

### CSV Files
- Plain text, comma-separated values
- Can be opened in Excel and edited
- Headers are case-insensitive in the bulk upload

```
Name,Email,Phone,Company,Receivables
John Doe,john@example.com,1234567890,Company Inc,5000
```

### Excel Files (.xlsx)
- Pre-formatted for bulk upload
- Column headers match exact field names
- Numbers are properly typed (not strings)
- Ready to drag-drop into bulk upload modal

### JSON File
- Complete backup of all data
- Can be used for API testing
- Reference format for developers

## 🔧 Customizing Sample Data

### Edit CSV files:
```bash
# Open in any text editor or Excel
tools/sample-data/clients_50.csv
tools/sample-data/items_50.csv
```

### Regenerate Excel files:
```bash
node tools/sample-data/generateExcelFiles.js
```

### Using as template:
1. Copy a CSV file
2. Edit in Excel/Sheets
3. Save as .xlsx
4. Upload via Bulk Upload Modal

## ✅ Import Checklist

Before uploading, verify:
- [ ] File format is .xlsx (Excel)
- [ ] Column headers match expected fields
- [ ] Required fields (Name, Category, etc.) are filled
- [ ] Phone numbers include country code
- [ ] Emails are valid format
- [ ] Rates are numbers (not text)

## 📈 Bulk Upload Features

The Billety bulk upload system:
- ✅ Validates all data before import
- ✅ Shows progress bar
- ✅ Displays success/error count
- ✅ Auto-refreshes data after upload
- ✅ Ignores rows with missing required fields
- ✅ Supports case-insensitive column headers

## 🐛 Troubleshooting

### Upload fails with error:
- Check file is .xlsx format (not .xls or .csv)
- Verify all required columns are present
- Ensure no duplicate entries if already imported

### Data doesn't appear:
- Check user authentication (must be logged in)
- Verify success toast notification
- Try refreshing the page
- Check data in the list view

### Need to delete data:
- Items/Clients can be deleted individually in the app
- For bulk delete, contact database admin
- Or reimport with updated data

## 📞 Support

For help with:
- **Bulk upload issues** → Check BulkUploadModal component
- **Sample data format** → Review construction-sample-data.json
- **Import problems** → Verify bulkUpload.service.ts

## 🎯 Next Steps

1. ✅ Generate Excel files (already done)
2. 📥 Open Billety application
3. 📤 Import Clients_50.xlsx via Bulk Upload
4. 📤 Import Items_50.xlsx via Bulk Upload
5. 🏗️ Create 3 sites manually (or via API)
6. 📋 Create invoices using the imported data

Enjoy testing! 🚀
