import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { colorSchemes } from "../../shared/themePrimitives";
import { getAllDocuments } from "../../firebase/firebaseUtils";
import { useEffect, useState } from "react";
import { GlobalUIService } from "../../utils/GlobalUIService";

// const invoice = [
//   {
//     amount: 1200,
//     balance: 1200,
//     customerName: "Alice Johnson",
//     customerId: "client001",
//     date: "2025-05-01",
//     duedate: "2025-06-01",
//     invoiceLink: "https://invoices.example.com/INV-1001",
//     orderNumber: "INV-1001",
//     status: "Unpaid",
//   },
const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1.5, minWidth: 70 },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "phone",
    headerName: "Phone Number",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "company",
    headerName: "Company",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "receivables",
    headerName: "Receivables",
    flex: 1,
    minWidth: 40,
  },
];

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const steps = [
    "Select master blaster campaign settings",
    "Create an ad group",
    "Create an ad",
  ];
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllDocuments("invoices");
        console.log("🚀 ~ fetchClients ~ data:", data);
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);
  return (
    <Stack width={"100%"}>
      <Stack
        spacing={2}
        direction={"row"}
        marginY={2}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Details
        </Typography>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ width: "fit-content" }}
        >
          Add Invoice
        </Button>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ backgroundColor: colorSchemes.dark.palette.background.paper }}
        >
          {"Add Client"}
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: colorSchemes.dark.palette.background.paper }}
        >
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid columns={columns} rows={invoices} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Invoices;
