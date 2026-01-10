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
import { APP_CONSTANTS } from "../../constants/app.constants";
// import CustomizedTreeView from "../../components/CustomizedTreeView/CustomizedTreeView";

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

import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";

const Clients = () => {
  const { clients, loading, refreshData } = useData();
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedClients, setSelectedClients] = React.useState<any[]>([]);

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

  const handleDelete = async () => {
    setConfirmOpen(false);
    GlobalUIService.setLoading(true);
    const ids = selectedClients;
    try {
      if (ids.length === 1) {
        await deleteDocument(APP_CONSTANTS.COLLECTIONS.CLIENTS, ids[0]);
      } else if (ids.length > 1) {
        await deleteDocumentsBatch(APP_CONSTANTS.COLLECTIONS.CLIENTS, ids);
      }
    } catch (error) {
      console.error("Error deleting clients:", error);
    } finally {
      refreshData();
      GlobalUIService.setLoading(false);
      setSelectedClients([]);
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
          {selectedClients.length > 0 && (
            <Button
              variant="outlined"
              sx={{ width: "fit-content", minWidth: "auto", padding: '5px' }}
              onClick={() => setConfirmOpen(true)}
            >
              <DeleteIcon sx={{ color: "red" }} />
            </Button>
          )}
        </Stack>
      </Stack>
      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Clients"
        content={`Are you sure you want to delete ${selectedClients.length} client(s)? This action cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
        confirmText="Delete"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: 'text.primary' }}
        >
          {"Add Client"}
        </DialogTitle>
        <DialogContent sx={{ color: 'text.secondary' }}>
          <Box sx={{ width: "100%" }}>
            <AddClientForm
              onSuccess={() => {
                handleClose();
                refreshData();
              }}
              onCancel={() => handleClose()}
            />
          </Box>
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid
            columns={columns}
            rows={clients}
            checkboxSelection
            onRowSelectionModelChange={({ ids }: any) => {
              const clientIds = Array.from(ids);
              setSelectedClients(clientIds);
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
