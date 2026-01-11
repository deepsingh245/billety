import { Dialog, DialogContent, DialogActions, Button, Box } from '@mui/material';
import InvoicePDF from './InvoicePDF';
import { Invoice } from '../../interfaces/invoice.interface';

interface TemplatePreviewDialogProps {
    open: boolean;
    onClose: () => void;
    templateId: string;
    onSelect: () => void;
}

const MOCK_INVOICE: Invoice = {
    id: 'PREVIEW-001',
    date: new Date().toISOString(),
    status: 'draft',
    totalAmount: 1250.00,
    client: {
        name: 'Sarah Connor',
        company: 'Skynet Solutions',
        email: 'sarah@resistance.com',
        phone: '+1 555 0199',
        receivables: 0,
    },
    items: [
        {
            id: '1',
            name: 'Web Design Service',
            description: 'UI/UX Design for Landing Page',
            quantity: 1,
            rate: 850,
            ratePerPiece: 850,
            ratePerKg: 0,
            unit: 'project',
            category: 'Design'
        },
        {
            id: '2',
            name: 'Consultation',
            description: '2 hours of technical consultation',
            quantity: 2,
            rate: 200,
            ratePerPiece: 200,
            ratePerKg: 0,
            unit: 'hr',
            category: 'Consulting'
        }
    ]
};

export default function TemplatePreviewDialog({ open, onClose, templateId, onSelect }: TemplatePreviewDialogProps) {
    // Create a temporary invoice object with the selected template ID to render the correct view
    const previewInvoice = { ...MOCK_INVOICE, templateId };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { height: '90vh' } }}
        >
            <DialogContent sx={{ p: 0, bgcolor: 'grey.100', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                <Box sx={{
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    overflowY: 'auto'
                }}>
                    <Box sx={{ width: '210mm', minHeight: '297mm', bgcolor: 'white', boxShadow: 3 }}>
                        <InvoicePDF invoice={previewInvoice} />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={onSelect} variant="contained" color="primary">Use This Template</Button>
            </DialogActions>
        </Dialog>
    );
}
