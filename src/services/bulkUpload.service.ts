import * as XLSX from 'xlsx';
import { createDocumentsBatch } from '../firebase/firebaseUtils';
import { getUserCollectionPath } from '../utils/firestorePath.utils';
import { APP_CONSTANTS } from '../constants/app.constants';
import { Client } from '../interfaces/client.interface';
import { Item } from '../interfaces/item.interface';

export type UploadType = 'client' | 'item';

export const parseExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

export const validateClientData = (data: any[]): Client[] => {
    return data.map(row => ({
        name: row.Name || row.name || '',
        email: row.Email || row.email || '',
        phone: row.Phone || row.phone || '',
        company: row.Company || row.company || '',
        receivables: Number(row.Receivables || row.receivables || 0),
        // Add more defaults or validation as needed
    })).filter(client => client.name && client.email); // Basic validation
};

export const validateItemData = (data: any[]): Item[] => {
    return data.map(row => ({
        name: row.Name || row.name || '',
        category: row.Category || row.category || '',
        ratePerKg: Number(row.RatePerKg || row.ratePerKg || 0),
        ratePerPiece: Number(row.RatePerPiece || row.ratePerPiece || 0),
        unit: row.Unit || row.unit || 'piece',
        description: row.Description || row.description || '',
    })).filter(item => item.name); // Basic validation
};

export const bulkUploadData = async (
    data: any[],
    type: UploadType,
    userId: string
): Promise<{ success: number; errors: number }> => {
    const collectionName = type === 'client'
        ? APP_CONSTANTS.COLLECTIONS.CLIENTS
        : APP_CONSTANTS.COLLECTIONS.ITEMS;

    const path = getUserCollectionPath(userId, collectionName);

    try {
        await createDocumentsBatch(path, data);
        return { success: data.length, errors: 0 };
    } catch (error) {
        console.error("Batch upload failed:", error);
        // Since batch fails completely or succeeds completely per chunk, 
        // we might not know exact success count if we don't track inside utility.
        // For simple impl, assume all failed if error throws (or we can refine utility to return stats)
        return { success: 0, errors: data.length };
    }
};

export const downloadTemplate = (type: UploadType) => {
    let data = [];
    if (type === 'client') {
        data = [{ Name: 'John Doe', Email: 'john@example.com', Phone: '1234567890', Company: 'Acme Corp', Receivables: 0 }];
    } else {
        data = [{ Name: 'Item Name', Category: 'Category A', RatePerKg: 10, RatePerPiece: 5, Unit: 'kg', Description: 'Description' }];
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${type}_template.xlsx`);
};
