import { useEffect, useState, useMemo } from "react";
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
  Divider,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { getDocument, updateDocument, getAllDocuments } from "../../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../../constants/app.constants";
import { ROUTES } from "../../constants/routes.constants";
import { handleError } from "../../utils/error.utils";
import { Invoice, InvoiceItem } from "../../interfaces/invoice.interface";
import { Client } from "../../interfaces/client.interface";
import { Item } from "../../interfaces/item.interface";
import InvoicePDF from "../../components/InvoicePDF/InvoicePDF";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import { exportToPDF } from "../../utils/pdf.utils";
import { sendInvoiceEmail } from "../../utils/email.utils";
import AddIcon from "@mui/icons-material/Add";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  // Item Selection State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      GlobalUIService.setLoading(true);
      const [invoiceData, clientsData, itemsData] = await Promise.all([
        getDocument<Invoice>(APP_CONSTANTS.COLLECTIONS.INVOICES, id!),
        getAllDocuments<Client>(APP_CONSTANTS.COLLECTIONS.CLIENTS),
        getAllDocuments<Item>(APP_CONSTANTS.COLLECTIONS.ITEMS),
      ]);

      if (invoiceData) {
        setInvoice(invoiceData);
      }
      setClients(clientsData);
      setItems(itemsData);
      GlobalUIService.setLoading(false);
    } catch (error) {
      handleError(error, "Error fetching invoice details");
      GlobalUIService.setLoading(false);
    }
  };

  const handleUpdateInvoice = async () => {
    if (!invoice || !id) return;

    GlobalUIService.setLoading(true);
    try {
      await updateDocument(APP_CONSTANTS.COLLECTIONS.INVOICES, id, invoice);
      GlobalUIService.setLoading(false);
      GlobalUIService.showToast(APP_CONSTANTS.MESSAGES.SAVE_SUCCESS);
    } catch (error) {
      handleError(error, "Error updating invoice");
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

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const handleAddItem = () => {
    if (!invoice || !selectedItem) return;

    const newItem: InvoiceItem = {
      name: selectedItem.name,
      category: selectedItem.category,
      ratePerKg: selectedItem.ratePerKg,
      ratePerPiece: selectedItem.ratePerPiece,
      unit: selectedItem.unit,
      description: selectedItem.description,
      quantity: 1,
      rate: selectedItem.ratePerPiece || selectedItem.ratePerKg || 0
    };

    const newItems = [...invoice.items, newItem];
    const total = newItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

    setInvoice({
      ...invoice,
      items: newItems,
      totalAmount: total
    });

    // Reset selection
    setSelectedItem(null);
  };

  const handleDownloadPDF = async () => {
    GlobalUIService.setLoading(true);
    await exportToPDF('invoice-preview', `Invoice-${invoice?.id || 'draft'}.pdf`);
    GlobalUIService.setLoading(false);
  };

  const handleSendEmail = async () => {
    if (!invoice?.client?.email) {
      GlobalUIService.showToast("Client email is missing!");
      return;
    }
    GlobalUIService.setLoading(true);
    try {
      await sendInvoiceEmail(invoice.client.email, id!);
      GlobalUIService.showToast(`Invoice sent to ${invoice.client.email}`);
    } catch (error) {
      handleError(error, "Failed to send email");
    } finally {
      GlobalUIService.setLoading(false);
    }
  };

  if (!invoice) return null; // Loader handled globally

  const EditSection = () => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom color="primary">Edit Invoice Details</Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>Client Details</Typography>
        <Autocomplete
          options={clients}
          getOptionLabel={(option) => option.name || ""}
          value={invoice.client}
          // isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={(_, newValue) => handleClientChange(newValue)}
          renderInput={(params) => <TextField {...params} size="small" fullWidth label="Select Client" />}
        />
      </Box>

      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>Add Item</Typography>
        <Stack spacing={2}>
          <Autocomplete
            options={categories}
            value={selectedCategory}
            onChange={(_, newValue) => {
              setSelectedCategory(newValue);
              setSelectedItem(null);
            }}
            renderInput={(params) => <TextField {...params} size="small" label="Category" />}
          />
          <Autocomplete
            options={filteredItems}
            getOptionLabel={(option) => option.name}
            value={selectedItem}
            onChange={(_, newValue) => setSelectedItem(newValue)}
            disabled={!selectedCategory}
            renderInput={(params) => <TextField {...params} size="small" label="Item" />}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={!selectedItem}
          >
            Add Item
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2}>
        {invoice.items.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <TextField
                variant="standard"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                placeholder="Item Name"
                fullWidth
                sx={{ mr: 2 }}
              />
              <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 6 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  size="small"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
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
          </Paper>
        ))}
      </Stack>
    </Paper>
  );

  const PreviewSection = () => (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        bgcolor: '#f0f2f5',
        p: 3,
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box id="invoice-preview" sx={{ width: '100%', maxWidth: '210mm', bgcolor: 'white', boxShadow: 3, minHeight: '297mm', p: 0 }}>
        <InvoicePDF invoice={invoice} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', p: 2, width: '100%' }}>
      {/* Header Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`${ROUTES.DASHBOARD.ROOT}/${ROUTES.DASHBOARD.INVOICES.ROOT}`)}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">Invoice {invoice.id}</Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          {!isMobile && (
            <>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPDF}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<SendIcon />}
                onClick={handleSendEmail}
              >
                Email
              </Button>
            </>
          )}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleUpdateInvoice}
          >
            Save
          </Button>
        </Stack>
      </Stack>

      {isMobile ? (
        <>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ mb: 2 }}>
            <Tab label="Edit" />
            <Tab label="Preview" />
          </Tabs>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            {tabIndex === 0 ? <EditSection /> : <PreviewSection />}
          </Box>
          {/* Mobile Actions Bottom Bar could be added here if needed */}
          {tabIndex === 1 && (
            <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}>Download</Button>
              <Button variant="outlined" startIcon={<SendIcon />} onClick={handleSendEmail}>Email</Button>
            </Stack>
          )}
        </>
      ) : (
        <Grid container spacing={3} sx={{ flex: 1, overflow: 'hidden' }}>
          <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%', overflowY: 'hidden' }}>
            <EditSection />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }} sx={{ height: '100%', overflowY: 'hidden' }}>
            <PreviewSection />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
