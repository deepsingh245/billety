import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Autocomplete,
} from "@mui/material";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { getDocument, updateDocument, getAllDocuments } from "../../firebase/firebaseUtils";
import { Collections } from "../../constants/collections.constants";
import { Invoice, InvoiceItem } from "../../interfaces/invoice.interface";
import { Client } from "../../interfaces/client.interface";
import { Item } from "../../interfaces/item.interface";
import InvoicePDF from "../../components/InvoicePDF/InvoicePDF";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoiceData, clientsData, itemsData] = await Promise.all([
        getDocument<Invoice>(Collections.INVOICES, id!),
        getAllDocuments<Client>(Collections.CLIENTS),
        getAllDocuments<Item>(Collections.ITEMS),
      ]);

      if (invoiceData) {
        setInvoice(invoiceData);
      }
      setClients(clientsData);
      setItems(itemsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setLoading(false);
    }
  };

  const handleUpdateInvoice = async () => {
    if (!invoice || !id) return;

    GlobalUIService.setLoading(true);
    try {
      await updateDocument(Collections.INVOICES, id, invoice);
      GlobalUIService.setLoading(false);
      // Optional: Show success toast
    } catch (error) {
      console.error("Error updating invoice:", error);
      GlobalUIService.setLoading(false);
    }
  };

  const handleClientChange = (client: Client | null) => {
    if (invoice && client) {
      setInvoice({ ...invoice, client });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!invoice) return;
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total
    const total = newItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    setInvoice({ ...invoice, items: newItems, totalAmount: total });
  };

  const handleRemoveItem = (index: number) => {
    if (!invoice) return;
    const newItems = [...invoice.items];
    newItems.splice(index, 1);
    const total = newItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    setInvoice({ ...invoice, items: newItems, totalAmount: total });
  };

  const handleAddItem = () => {
    if (!invoice) return;
    // Add a placeholder item or open a selector
    // For simplicity, adding a blank item that user can edit or select from
    // Ideally, we'd reuse the item selector logic here.
    // Let's just add a default item for now
    const newItem: InvoiceItem = {
      name: "New Item",
      category: "",
      ratePerKg: 0,
      ratePerPiece: 0,
      unit: "piece",
      description: "",
      quantity: 1,
      rate: 0
    };
    setInvoice({ 
      ...invoice, 
      items: [...invoice.items, newItem] 
    });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!invoice) return <Typography>Invoice not found</Typography>;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard/invoices')}>
          Back to Invoices
        </Button>
        <Typography variant="h5">Edit Invoice</Typography>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />} 
          onClick={handleUpdateInvoice}
        >
          Save Changes
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Edit Form */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%', overflowY: 'auto' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Invoice Details</Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Client</Typography>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name || ""}
                value={invoice.client}
                onChange={(_, newValue) => handleClientChange(newValue)}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </Box>

            <Typography variant="h6" gutterBottom>Items</Typography>
            {invoice.items.map((item, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>{item.name}</Typography>
                  <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Quantity"
                      type="number"
                      size="small"
                      fullWidth
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Rate"
                      type="number"
                      size="small"
                      fullWidth
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            
            <Button variant="outlined" fullWidth onClick={handleAddItem}>
              Add Item
            </Button>
          </Paper>
        </Grid>

        {/* Right Side: PDF Preview */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ height: '100%', overflowY: 'auto', bgcolor: '#f5f5f5', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '800px' }}>
              <InvoicePDF invoice={invoice} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
