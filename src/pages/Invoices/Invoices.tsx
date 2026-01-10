import { Button, Chip, Grid, Stack, Typography } from "@mui/material";
import { APP_CONSTANTS } from "../../constants/app.constants";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { useData } from "../../context/dataContext";
import InvoiceDialog from "./InvoiceDialog";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDocument, deleteDocumentsBatch } from "../../firebase/firebaseUtils";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";
import SendIcon from '@mui/icons-material/Send';

const Invoices = () => {
  const { filteredInvoices: invoices, loading } = useData();
  const [open, setOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

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
            {new Date(param.value).toLocaleDateString()}
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
              width: 'fit-content',
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
          <Stack direction="row" spacing={1} sx={{ border: 'none' }}>
            <Button
              variant="text"
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const { refreshData } = useData();

  const handleDelete = async () => {
    setConfirmOpen(false);
    GlobalUIService.setLoading(true);
    try {
      if (selectedInvoices.length === 1) {
        await deleteDocument(APP_CONSTANTS.COLLECTIONS.INVOICES, selectedInvoices[0]);
      } else if (selectedInvoices.length > 1) {
        await deleteDocumentsBatch(APP_CONSTANTS.COLLECTIONS.INVOICES, selectedInvoices);
      }
    } catch (error) {
      console.error("Error deleting invoices:", error);
    } finally {
      refreshData();
      GlobalUIService.setLoading(false);
      setSelectedInvoices([]);
    }
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ width: "fit-content" }}
          >
            Add Invoice
          </Button>
          {selectedInvoices.length > 0 && (
            <>
              <Button
                variant="outlined"
                onClick={handleSendToClient}
                sx={{ width: "fit-content", display: "flex", alignItems: "center", gap: "5px" }}>
                <SendIcon sx={{ width: "20px", height: "20px" }} />
                Send to Client
              </Button>
              <Button
                variant="outlined"
                sx={{ width: "fit-content", minWidth: "auto", padding: '5px' }}
                onClick={() => setConfirmOpen(true)}>
                <DeleteIcon sx={{ color: "red" }} />
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      <InvoiceDialog
        open={open}
        onClose={() => handleClose()}
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
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids: any) => {
              console.log("🚀 ~ Invoices ~ ids:", ids)
              const selectedRows = Array.from<string>(ids.ids);
              setSelectedInvoices(selectedRows);
            }}
          />
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Invoices"
        content={`Are you sure you want to delete ${selectedInvoices.length} invoice(s)? This action cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
        confirmText="Delete"
      />
    </Stack>
  );
};

export default Invoices;
