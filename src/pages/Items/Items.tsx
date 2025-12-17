import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { getAllDocuments } from "../../firebase/firebaseUtils";
import { useEffect, useState } from "react";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { Collections } from "../../constants/collections.constants";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import AddItemForm from "../../components/AddItemForm/AddItemForm";

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
    flex: 1,
    width: 30,
  },
  {
    field: "ratePerPiece",
    headerName: "Rate/Piece",
    flex: 1,
    width: 30,
  },
  {
    field: "unit",
    headerName: "Unit",
    flex: 1,
    width: 30,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    width: 200,
  },
];

function Items() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  
  const fetchItems = async () => {
    GlobalUIService.setLoading(true);
    try {
      const data = await getAllDocuments(Collections.ITEMS);
      console.log("🚀 ~ fetchItems ~ data:", data);
      setItems(data);
      GlobalUIService.setLoading(false);
    } catch (error) {
      GlobalUIService.setLoading(false);
      console.error("Error fetching items:", error);
    }
  };

  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccess = () => {
    handleClose();
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
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
          Add Item
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="add-item-dialog-title">Add Item</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <AddItemForm onSuccess={handleSuccess} />
          </Box>
        </DialogContent>
      </Dialog>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid rows={items} columns={columns} />
        </Grid>
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
