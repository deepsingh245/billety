import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Grid } from "@mui/material";
import { Invoice } from "../../interfaces/invoice.interface";

interface InvoicePDFProps {
  invoice: Invoice;
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Paper
      // elevation={3}
      sx={{
        p: 4,
        minHeight: '800px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Arial, sans-serif',
        height: '100%'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>INVOICE</Typography>
          <Typography variant="body2">Invoice #: {invoice.id?.slice(0, 8).toUpperCase() || 'DRAFT'}</Typography>
          <Typography variant="body2">Date: {new Date(invoice.date).toLocaleDateString()}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>My Company Name</Typography>
          <Typography variant="body2">123 Business Rd.</Typography>
          <Typography variant="body2">City, Country 12345</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Client Info */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ xs: 6 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>BILL TO:</Typography>
          <Typography variant="h6">{invoice.client?.name}</Typography>
          <Typography variant="body2">{invoice.client?.company}</Typography>
          <Typography variant="body2">{invoice.client?.email}</Typography>
          <Typography variant="body2">{invoice.client?.phone}</Typography>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer component={Box} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Item Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'black' }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'black' }}>Rate</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'black' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                  <Typography variant="caption" color="textSecondary">{item.description}</Typography>
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
                <TableCell align="right">{(item.quantity * item.rate).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ width: '250px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Subtotal:</Typography>
            <Typography variant="body2">${invoice.totalAmount.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Tax (0%):</Typography>
            <Typography variant="body2">$0.00</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              ${invoice.totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 8, textAlign: 'center', color: '#666', alignSelf: 'end' }}>
        <Typography variant="body2">Thank you for your business!</Typography>
      </Box>
    </Paper>
  );
}
