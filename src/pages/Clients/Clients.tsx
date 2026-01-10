import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AddClientForm from "../../components/AddClientForm/AddClientForm";
import { colorSchemes } from "../../shared/themePrimitives";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { useData } from "../../context/dataContext";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDocument, deleteDocumentsBatch } from "../../firebase/firebaseUtils";
import { COLLECTIONS } from "../../constants/collections.constants";
import CustomizedTreeView from "../../components/CustomizedTreeView/CustomizedTreeView";

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

const Clients = () => {
  const { clients, loading, refreshData } = useData();
  const [open, setOpen] = React.useState(false);
  const [selectedInvoices, setSelectedInvoices] = React.useState<any[]>([]);

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

  const handleDelete = async (ids: string[]) => {
    GlobalUIService.setLoading(true);
    try {
      if (ids.length === 1) {
        await deleteDocument(COLLECTIONS.CLIENTS, ids[0]);
      } else if (ids.length > 1) {
        await deleteDocumentsBatch(COLLECTIONS.CLIENTS, ids);
      }
    } catch (error) {
      console.error("Error deleting clients:", error);
    } finally {
      refreshData();
      GlobalUIService.setLoading(false);
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
          Details
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ width: "fit-content" }}
          >
            Add Client
          </Button>
          <Button
            variant="text"
            sx={{ width: "fit-content", padding: 0 }}
            onClick={() => handleDelete(selectedInvoices.map((invoice) => invoice.id))}
          >
            <DeleteIcon sx={{ color: "red" }} />
          </Button>
        </Stack>
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
            <AddClientForm onSuccess={() => {
              handleClose();
              refreshData();
            }} />
          </Box>
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid
            columns={columns}
            rows={clients}
            checkboxSelection
            onRowSelectionModelChange={(ids: any) => {
              const selectedRows = clients.filter((row) => ids.includes(row.id));
              setSelectedInvoices(selectedRows);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            {/* <CustomizedTreeView /> */}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Clients;
