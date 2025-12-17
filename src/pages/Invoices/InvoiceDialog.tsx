import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Autocomplete,
  TextField,
  Typography,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { colorSchemes } from "../../shared/themePrimitives";
import { getAllDocuments, createDocument } from "../../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../../constants/app.constants";
import { ROUTES } from "../../constants/routes.constants";
import { Client } from "../../interfaces/client.interface";
import { Item } from "../../interfaces/item.interface";
import { InvoiceItem } from "../../interfaces/invoice.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { handleError } from "../../utils/error.utils";
import { useData } from "../../context/dataContext";

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}



export default function InvoiceDialog({
  open,
  onClose,
  title = "Create Invoice",
}: InvoiceDialogProps) {
  const navigate = useNavigate();
  const { refreshData } = useData();
  const [activeStep, setActiveStep] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  // Temporary state for adding a new item line
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentRate, setCurrentRate] = useState<number>(0);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [clientsData, itemsData] = await Promise.all([
        getAllDocuments<Client>(APP_CONSTANTS.COLLECTIONS.CLIENTS),
        getAllDocuments<Item>(APP_CONSTANTS.COLLECTIONS.ITEMS),
      ]);
      setClients(clientsData);
      setItems(itemsData);
    } catch (error) {
      handleError(error, "Error fetching data");
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAddItem = () => {
    if (currentItem && currentQuantity > 0) {
      setInvoiceItems([
        ...invoiceItems,
        {
          ...currentItem,
          quantity: currentQuantity,
          rate: currentRate,
        },
      ]);
      setCurrentItem(null);
      setCurrentQuantity(1);
      setCurrentRate(0);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };

  const handleCreateInvoice = async () => {
    if (!selectedClient || invoiceItems.length === 0) return;

    GlobalUIService.setLoading(true);
    try {
      const invoiceData = {
        client: selectedClient,
        items: invoiceItems,
        date: new Date().toISOString(),
        status: "draft",
        totalAmount: invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0),
      };

      const docRef = await createDocument(APP_CONSTANTS.COLLECTIONS.INVOICES, invoiceData);
      await refreshData();
      GlobalUIService.setLoading(false);
      onClose();
      // Navigate to the edit/view page
      navigate(`${ROUTES.DASHBOARD.ROOT}/${APP_CONSTANTS.COLLECTIONS.INVOICES}/${docRef}`);
    } catch (error) {
      handleError(error, "Error creating invoice");
      GlobalUIService.setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedClient(null);
    setInvoiceItems([]);
    onClose();
  };

  // const steps = ["Select Client", "Add Items", "Review & Create"];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ backgroundColor: colorSchemes.dark.palette.background.paper }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colorSchemes.dark.palette.background.paper }}>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {/* Step 1: Select Client */}
            <Step>
              <StepLabel>Select Client</StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => option.name || ""}
                    value={selectedClient}
                    onChange={(_, newValue) => setSelectedClient(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Client" variant="outlined" fullWidth />
                    )}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!selectedClient}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 2: Add Items */}
            <Step>
              <StepLabel>Add Items</StepLabel>
              <StepContent>
                <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Add New Item Line</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <Autocomplete
                      options={items}
                      getOptionLabel={(option) => option.name || ""}
                      value={currentItem}
                      onChange={(_, newValue) => {
                        setCurrentItem(newValue);
                        if (newValue) {
                          setCurrentRate(newValue.ratePerPiece || newValue.ratePerKg || 0);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Item" variant="outlined" sx={{ minWidth: 200 }} />
                      )}
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Quantity"
                      type="number"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Rate"
                      type="number"
                      value={currentRate}
                      onChange={(e) => setCurrentRate(Number(e.target.value))}
                      sx={{ flex: 1 }}
                    />
                    <IconButton onClick={handleAddItem} color="primary" disabled={!currentItem}>
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </Box>

                {/* List of added items */}
                {invoiceItems.length > 0 && (
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoiceItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.rate}</TableCell>
                            <TableCell align="right">{(item.quantity * item.rate).toFixed(2)}</TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleRemoveItem(index)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={invoiceItems.length === 0}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 3: Review */}
            <Step>
              <StepLabel>Review & Create</StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Client: {selectedClient?.name}</Typography>
                  <Typography variant="subtitle1">
                    Total Amount: {invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoiceItems.length} items selected
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleCreateInvoice}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Create Invoice
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
