import { Button, Chip, Grid, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { useData } from "../../context/dataContext";
import InvoiceDialog from "./InvoiceDialog";
import { Invoice } from "../../interfaces/invoice.interface";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const { invoices, loading } = useData();
  const [open, setOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    GlobalUIService.setLoading(loading);
  }, [loading]);

  const navigate = useNavigate();
  const columns: GridColDef[] = useMemo(() => [
    { field: "name", headerName: "Client Name", flex: 1, minWidth: 150 },
    {
      field: "email",
      headerName: "Email Address",
      flex: 1.5,
      minWidth: 250,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1.5,
      minWidth: 180,
      renderCell: (param) => {
        return (
          <Typography variant="body2" sx={{ fontWeight: '500' }}>
            {param.value}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Chip
            sx={{
              width: 'fit-cntent',
              backgroundColor: params.value === 'Paid' ? 'green' : 'red'
            }}
            label={params.value}
          />
        );
      },
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/dashboard/invoices/${params.row.id}`)}
            >
              <RemoveRedEyeIcon />
            </Button>
          </Stack>
        );
      },
    },
  ], []);

  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendToClient = () => {
    GlobalUIService.setLoading(false);
    setTimeout(() => {
      GlobalUIService.setLoading(false);
    }, 2000);
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
          <CustomizedDataGrid columns={columns} rows={invoices?.map((invoice) => ({
            ...invoice,
            name: invoice?.client?.name,
            email: invoice?.client?.email,
            phone: invoice?.client?.phone,
          }))}
            onRowClick={(params) => {
              setSelectedInvoices([params.row]);
            }}
          />
        </Grid>
        <Button
          variant="outlined"
          onClick={handleSendToClient}
          sx={{ width: "fit-content" }}
          disabled={selectedInvoices?.length === 0}
        >
          Send to Client
        </Button>
      </Grid>
    </Stack>
  );
};

export default Invoices;
