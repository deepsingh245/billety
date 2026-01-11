import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Grid } from "@mui/material";
import { Invoice } from "../../../interfaces/invoice.interface";
import { useData } from "../../../context/dataContext";
import { CURRENCY } from "../../../constants/app.constants";

interface InvoicePDFProps {
    invoice: Invoice;
}

export default function MinimalTemplate({ invoice }: InvoicePDFProps) {
    const { currentProject } = useData();
    const currency = useData().settings.currency;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 5,
                minHeight: '800px',
                backgroundColor: 'white',
                color: '#333',
                fontFamily: "'Inter', sans-serif", // Cleaner font if available, fallback to sans-serif
                height: '100%',
                position: 'relative'
            }}
        >
            {/* Modern Header - Left aligned, clean */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: '300', letterSpacing: 2, mb: 1 }}>INVOICE</Typography>
                <Typography variant="subtitle2" sx={{ color: '#888', letterSpacing: 1 }}>#{invoice.id?.slice(0, 8).toUpperCase() || 'DRAFT'}</Typography>
            </Box>

            {/* From / To Section - Grid Layout */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>From</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>{currentProject?.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>{currentProject?.category}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>Bill To</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>{invoice.client?.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>{invoice.client?.company}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>{invoice.client?.email}</Typography>
                </Grid>
            </Grid>

            <Box sx={{ mb: 6 }}>
                <Typography variant="caption" sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>Date</Typography>
                <Typography variant="body1">{new Date(invoice.date).toLocaleDateString()}</Typography>
            </Box>

            {/* Minimal Table */}
            <TableContainer component={Box} sx={{ mb: 6 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ borderBottom: '2px solid #333', color: '#333', fontWeight: 'bold', py: 2 }}>Item</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #333', color: '#333', fontWeight: 'bold', py: 2 }}>Qty</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #333', color: '#333', fontWeight: 'bold', py: 2 }}>Rate</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #333', color: '#333', fontWeight: 'bold', py: 2 }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoice.items.map((item, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ py: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>{item.name}</Typography>
                                    {item.description && <Typography variant="caption" color="textSecondary">{item.description}</Typography>}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 2, color: 'black' }}>{item.quantity}</TableCell>
                                <TableCell align="right" sx={{ py: 2, color: 'black' }}>{item.rate.toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ py: 2, color: 'black', fontWeight: '500' }}>{(item.quantity * item.rate).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Total Section - Clean, no box */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Box sx={{ minWidth: '200px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666' }}>Subtotal</Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>{`${CURRENCY[currency]}${invoice.totalAmount.toFixed(2)}`}</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: '300' }}>Total</Typography>
                        <Typography variant="h5" sx={{ fontWeight: '600' }}>{`${CURRENCY[currency]}${invoice.totalAmount.toFixed(2)}`}</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
