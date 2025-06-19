export interface Invoice {
  amount: number;
  balance: number;
  customerName: string;
  date: number;    
  duedate: number; 
  invoiceLink: string;
  orderNumber: string;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
}
