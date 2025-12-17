import { Client } from "./client.interface";
import { Item } from "./item.interface";

export interface InvoiceItem extends Item {
  quantity: number;
  rate: number;
}

export interface Invoice {
  id?: string;
  client: Client;
  items: InvoiceItem[];
  date: string;
  dueDate?: string;
  status: 'draft' | 'sent' | 'paid';
  totalAmount: number;
  
  // Legacy fields support
  amount?: number;
  balance?: number;
  customerName?: string;
  invoiceLink?: string;
  orderNumber?: string;
}
