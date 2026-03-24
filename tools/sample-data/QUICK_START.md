# 🚀 Quick Start Guide - Bulk Import Sample Data

## Step-by-Step: Import 50 Clients

### Step 1: Navigate to Clients Section
```
1. Open Billety application
2. Click on "Clients" in the left sidebar (or main menu)
3. You'll see the clients list (currently empty)
```

### Step 2: Access Bulk Upload
```
1. Look for "Bulk Upload" button (usually top-right area)
2. Click the button → BulkUploadModal opens
3. You'll see two options: "Client" and "Item" types
```

### Step 3: Select File Type & Upload
```
1. Make sure "Client" is selected in the dropdown
2. Click "Upload File" button
3. Select: tools/sample-data/Clients_50.xlsx
4. Click "Open" to select the file
5. You'll see a progress bar
6. Green toast notification confirms success: "50 clients uploaded!"
```

### Step 4: Verify Import
```
1. The modal closes automatically
2. Clients list refreshes and shows all 50 new clients
3. You can search/filter the client list
```

---

## Step-by-Step: Import 50 Items

### Step 1: Navigate to Items Section
```
1. Click on "Items" in the left sidebar
2. You'll see the items list (currently empty)
```

### Step 2: Access Bulk Upload
```
1. Click "Bulk Upload" button
2. BulkUploadModal opens
```

### Step 3: Select File Type & Upload
```
1. Select "Item" from the dropdown
2. Click "Upload File"
3. Select: tools/sample-data/Items_50.xlsx
4. Click "Open"
5. Progress bar shows upload progress
6. Green toast: "50 items uploaded!"
```

### Step 4: Verify Import
```
1. Items list automatically refreshes
2. All 50 items appear, categorized
3. You can filter by category:
   - Steel & Iron (2 items)
   - Building Materials (5 items)
   - Hardware (4 items)
   - Tiles & Flooring (3 items)
   - Paints & Coatings (3 items)
   - Plumbing (4 items)
   - Electrical (5 items)
   - Roofing (3 items)
   - Finishing (5 items)
   - Equipment (2 items)
   - Concrete (2 items)
   - Doors & Windows (3 items)
   - Bricks & Blocks (2 items)
   - Aggregates (2 items)
```

---

## Manual: Create 3 Sites

**Note:** Sites don't have bulk upload yet, so create manually:

### Site 1: Central Business Complex
```
1. Go to "Projects" or "Sites" section
2. Click "New Site" / "New Project"
3. Fill in:
   - Name: Central Business Complex
   - Category: Commercial Building
   - Location: Downtown
4. Click "Create"
```

### Site 2: Residential Complex - Phase II
```
1. Click "New Site" again
2. Fill in:
   - Name: Residential Complex - Phase II
   - Category: Residential Building
   - Location: North District
3. Click "Create"
```

### Site 3: Industrial Park Development
```
1. Click "New Site" again
2. Fill in:
   - Name: Industrial Park Development
   - Category: Industrial Building
   - Location: Industrial Zone
3. Click "Create"
```

---

## 📊 What You Get After Import

### Clients Database
```
✅ 50 real-looking construction company clients
✅ Realistic email addresses
✅ Valid phone numbers with country codes
✅ Company names with variations
✅ Sample receivable amounts (₹3,500 - ₹15,000)
```

### Items Catalog
```
✅ 50 construction materials and equipment
✅ 14 different categories
✅ Price data in both kg and per-piece rates
✅ Unit types: piece, kg, meter, liter, sqft, bag
✅ Professional descriptions
```

### Sites/Projects
```
✅ 3 different project types (Commercial, Residential, Industrial)
✅ Location information
✅ Real-looking project names
```

---

## 🎯 Next Steps After Import

### Create Your First Invoice
```
1. Go to "Invoices" section
2. Click "New Invoice"
3. Select a client (now 50 to choose from!)
4. Select items from the catalog (50 options!)
5. Add quantities and rates
6. Generate PDF
7. Send to client
```

### Try Different Features
```
✅ Filter clients by company
✅ Search items by category
✅ Create invoices with multiple items
✅ Export invoice data
✅ Test PDF generation
✅ Try multi-language support
```

### Test Bulk Operations
```
✅ Add more clients via bulk upload
✅ Update item prices
✅ Create multiple invoices
✅ Test receivables tracking
```

---

## 📁 File Locations

```
tools/sample-data/
├── Clients_50.xlsx          👈 Upload this for clients
├── Items_50.xlsx            👈 Upload this for items
├── clients_50.csv           (Backup/reference)
├── items_50.csv             (Backup/reference)
├── construction-sample-data.json  (All data in JSON format)
├── generateExcelFiles.js    (Regenerate Excel if needed)
└── README.md                (Detailed documentation)
```

---

## ⚡ Quick Reference

| Action | File | Steps |
|--------|------|-------|
| Import Clients | Clients_50.xlsx | Clients → Bulk Upload → Select file |
| Import Items | Items_50.xlsx | Items → Bulk Upload → Select file |
| Create Sites | Manual | 3 times: Projects → New → Fill details |
| Generate Invoice | Any client + items | Invoices → New → Select client/items |

---

## 🐛 Troubleshooting

### "File not found" error
→ Check file path: `tools/sample-data/Clients_50.xlsx`

### Upload shows 0 records
→ Verify Excel file has data rows (not just headers)

### Items appear but no prices
→ Check Units and Rates columns are filled

### Can't find the bulk upload button
→ It's in the same section (Clients/Items) as the data list

---

## 💡 Pro Tips

1. **Download Template First** - Check the template format in bulk upload
2. **Verify Column Headers** - Must match exactly (case-insensitive)
3. **Use Generated Files** - They're pre-formatted and ready
4. **Test with Small File** - Try uploading one client first
5. **Check Success Toast** - Green notification confirms upload

---

## 📞 If Something Goes Wrong

1. **Check console** - Browser dev tools (F12) for error messages
2. **Verify login** - Must be logged in with a valid Billety account
3. **Check file format** - Must be .xlsx (Excel), not .csv or .xls
4. **Try again** - Sometimes retry works after refresh
5. **Contact support** - File issue with sample data format

---

**Ready to go!** 🎉

Follow the steps above and you'll have:
- ✅ 50 clients imported
- ✅ 50 items with pricing
- ✅ 3 construction sites set up
- ✅ Full data to create invoices and test all features
