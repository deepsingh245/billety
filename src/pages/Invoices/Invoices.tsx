import { Button, Grid, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { useData } from "../../context/dataContext";
import InvoiceDialog from "./InvoiceDialog";

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
  { field: "name", headerName: "Name", flex: 1, minWidth: 70 },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "phoneNumber",
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
  const { invoices, loading } = useData();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    GlobalUIService.setLoading(loading);
  }, [loading]);

  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
          Invoices
        </Typography>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ width: "fit-content" }}
        >
          Add Invoice
        </Button>
      </Stack>

      <InvoiceDialog
        open={open}
        onClose={handleClose}
        title="Add Invoice"
      />
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid columns={columns} rows={invoices} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Invoices;
