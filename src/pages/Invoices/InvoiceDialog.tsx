import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
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
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getAllDocuments, createDocument } from "../../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../../constants/app.constants";
import { ROUTES } from "../../constants/routes.constants";
import { Client } from "../../interfaces/client.interface";
import { Item } from "../../interfaces/item.interface";
import { InvoiceItem } from "../../interfaces/invoice.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { handleError } from "../../utils/error.utils";
import { CustomAutocomplete } from "../../components/CustomAutocomplete/CustomAutocomplete";
import { useData } from "../../context/dataContext";
import { colorSchemes } from "../../shared/themePrimitives";

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export default function InvoiceDialog({
  open,
  onClose,
  title = "Create New Invoice",
}: InvoiceDialogProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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

  const totalAmount = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  // Custom colors derived from the theme primitives
  const dialogBg = colorSchemes.dark.palette.background.paper;
  const contentBg = colorSchemes.dark.palette.background.default;
  const accentColor = colorSchemes.dark.palette.primary.main;
  const borderColor = colorSchemes.dark.palette.divider;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          backgroundColor: dialogBg,
          backgroundImage: 'none',
          borderRadius: fullScreen ? 0 : 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: `1px solid ${borderColor}`,
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${borderColor}`,
        background: `linear-gradient(to right, ${colorSchemes.dark.palette.background.paper}, ${colorSchemes.dark.palette.background.default})`
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            display: 'flex'
          }}>
            <ReceiptIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create and manage invoice details
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: fullScreen ? 'auto' : 500 }}>
          {/* Left Sidebar - Stepper */}
          <Box sx={{
            width: 250,
            borderRight: `1px solid ${borderColor}`,
            p: 3,
            display: { xs: 'none', md: 'block' },
            bgcolor: contentBg
          }}>
            <Stepper activeStep={activeStep} orientation="vertical" connector={<span style={{ backgroundColor: borderColor, height: 50, width: '2px', marginLeft: '10px' }} />}>
              <Step>
                <StepLabel
                  StepIconComponent={(props) => (
                    <Box sx={{
                      color: props.active ? accentColor : props.completed ? 'success.main' : 'text.disabled',
                    }}>
                      {props.completed ? <CheckCircleIcon /> : <PersonIcon />}
                    </Box>
                  )}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: activeStep === 0 ? 700 : 400 }}>
                    Select Client
                  </Typography>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  StepIconComponent={(props) => (
                    <Box sx={{
                      color: props.active ? accentColor : props.completed ? 'success.main' : 'text.disabled',
                    }}>
                      {props.completed ? <CheckCircleIcon /> : <ShoppingCartIcon />}
                    </Box>
                  )}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: activeStep === 1 ? 700 : 400 }}>
                    Add Items
                  </Typography>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  StepIconComponent={(props) => (
                    <Box sx={{
                      color: props.active ? accentColor : props.completed ? 'success.main' : 'text.disabled',
                    }}>
                      {props.completed ? <CheckCircleIcon /> : <ReceiptIcon />}
                    </Box>
                  )}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: activeStep === 2 ? 700 : 400 }}>
                    Review
                  </Typography>
                </StepLabel>
              </Step>
            </Stepper>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            {/* Mobile Stepper Hint */}
            <Box sx={{ display: { md: 'none' }, mb: 3 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Step {activeStep + 1} of 3
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {activeStep === 0 ? "Who is this invoice for?" : activeStep === 1 ? "What are you charging for?" : "Review Invoice"}
              </Typography>
            </Box>

            {/* Step 1 Content */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
                  Who is this invoice for?
                </Typography>

                <CustomAutocomplete
                  options={clients}
                  value={selectedClient}
                  onChange={setSelectedClient}
                  getOptionLabel={(option: Client) => option.name || ""}
                  placeholder="Type client name..."
                  renderOptionContent={(option: Client) => (
                    <Box>
                      <Typography variant="body1" fontWeight="500">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.email}</Typography>
                    </Box>
                  )}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '50px'
                    }
                  }}
                />

                {selectedClient && (
                  <Card variant="outlined" sx={{ mt: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Selected Client</Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                          width: 48, height: 48, borderRadius: '50%',
                          bgcolor: 'primary.main', color: 'primary.contrastText',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.2rem', fontWeight: 'bold'
                        }}>
                          {selectedClient.name.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="h6">{selectedClient.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedClient.email}</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedClient.phone}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}

            {/* Step 2 Content */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
                  Add Line Items
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3, borderColor: `${accentColor}50`, bgcolor: `${accentColor}08` }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="600">NEW ITEM</Typography>
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                    <CustomAutocomplete
                      options={items}
                      getOptionLabel={(option: Item) => option.name || ""}
                      value={currentItem}
                      onChange={(newValue) => {
                        setCurrentItem(newValue);
                        if (newValue) {
                          setCurrentRate(newValue.ratePerPiece || newValue.ratePerKg || 0);
                        }
                      }}
                      placeholder="Type item name..."
                      sx={{ flex: 3 }}
                      renderOptionContent={(option: Item) => (
                        <Box>
                          <Typography variant="body1">{option.name}</Typography>
                        </Box>
                      )}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddItem}
                      disabled={!currentItem}
                      startIcon={<AddIcon />}
                      sx={{ height: 40, color: `${!currentItem ? 'gray !important' : 'theme.palette.primary.contrastText !important'}` }}
                    >
                      Add
                    </Button>
                  </Stack>
                </Paper>

                {invoiceItems.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item Details</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoiceItems.map((item, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">{item.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{item.unit || 'pcs'}</Typography>
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>{(item.quantity * item.rate).toFixed(2)}</TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                    <ShoppingCartIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                    <Typography>No items added yet</Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h6">Total: {totalAmount.toFixed(2)}</Typography>
                </Box>
              </Box>
            )}

            {/* Step 3 Content */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
                  Review & Create
                </Typography>

                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase">Bill To</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>{selectedClient?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedClient?.email}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedClient?.phone}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" textTransform="uppercase">Invoice Summary</Typography>
                      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="body2">Total Items</Typography>
                        <Typography variant="body2" fontWeight="500">{invoiceItems.length}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="h6" color="primary">Total Amount</Typography>
                        <Typography variant="h6" color="primary">{totalAmount.toFixed(2)}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>Item List</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Rate</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.rate}</TableCell>
                          <TableCell align="right">{(item.quantity * item.rate).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: dialogBg }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<NavigateBeforeIcon />}
            >
              Back
            </Button>
          )}

          {activeStep < 2 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 ? !selectedClient : invoiceItems.length === 0}
              endIcon={<NavigateNextIcon />}
              sx={{ height: 40, color: `${activeStep === 0 ? !selectedClient : invoiceItems.length === 0 ? 'gray !important' : 'theme.palette.primary.contrastText !important'}` }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleCreateInvoice}
              startIcon={<CheckCircleIcon />}
              color="success"
              sx={{ px: 4 }}
            >
              Create Invoice
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog >
  );
}
