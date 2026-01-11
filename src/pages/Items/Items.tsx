import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useData } from "../../context/dataContext";
import { useAuth } from "../../context/AuthContext";
import { getUserCollectionPath } from "../../utils/firestorePath.utils";
import { useEffect, useState } from "react";
import { GlobalUIService } from "../../utils/GlobalUIService";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDocument, deleteDocumentsBatch } from "../../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../../constants/app.constants";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";
import BulkUploadModal from "../../components/BulkUploadModal/BulkUploadModal";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1.5, minWidth: 200 },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    width: 80,
  },
  {
    field: "ratePerKg",
    headerName: "Rate/Kg",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "ratePerPiece",
    headerName: "Rate/Piece",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "unit",
    headerName: "Unit",
    flex: 0.5,
    minWidth: 60,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1.5,
    minWidth: 200,
  },
];

function Items() {
  const { items, loading, refreshData } = useData();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setConfirmOpen(false);
    GlobalUIService.setLoading(true);
    const ids = selectedItems.map(i => i.id);
    if (!user) return;
    try {
      if (ids.length === 1) {
        await deleteDocument(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.ITEMS), ids[0]);
      } else if (ids.length > 1) {
        await deleteDocumentsBatch(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.ITEMS), ids);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
    } finally {
      await refreshData();
      GlobalUIService.setLoading(false);
      setSelectedItems([]);
    }
  };

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

  const handleSuccess = async () => {
    handleClose();
    await refreshData();
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => setUploadModalOpen(true)}
            sx={{ width: "fit-content" }}
          >
            Bulk Upload
          </Button>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ width: "fit-content" }}
          >
            Add Item
          </Button>

          {selectedItems.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => setConfirmOpen(true)}
              sx={{ width: "fit-content", minWidth: "auto", padding: '5px' }}
            >
              <DeleteIcon sx={{ color: "red" }} />
            </Button>
          )}
        </Stack>

      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-dialog-title"
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          }
        }}
      >
        <DialogTitle id="add-item-dialog-title" sx={{ color: 'text.primary' }}>Add Item</DialogTitle>
        <DialogContent sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }}>
            <AddItemForm onSuccess={handleSuccess} onClose={handleClose} />
          </Box>
        </DialogContent>
      </Dialog>

      <BulkUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        type="item"
      />

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid
            rows={items}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(ids: any) => {
              const selectedRows = Array.from<string>(ids.ids);
              setSelectedItems(selectedRows);
            }}
          />
        </Grid>
        <ConfirmationDialog
          open={confirmOpen}
          title="Delete Items"
          content={`Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setConfirmOpen(false)}
          confirmText="Delete"
        />
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            {/* <CustomizedTreeView /> */}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Items;
