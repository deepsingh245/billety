import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { getAllDocuments } from "../../firebase/firebaseUtils";
import { useEffect, useState } from "react";
import { GlobalUIService } from "../../utils/GlobalUIService";

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
  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchItems = async () => {
      GlobalUIService.setLoading(true);
      try {
        const data = await getAllDocuments("items");
        console.log("🚀 ~ fetchClients ~ data:", data);
        setItems(data);
        GlobalUIService.setLoading(false);
      } catch (error) {
        GlobalUIService.setLoading(false);
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // const handleUpload = async () => {
  //   try {
  //     GlobalUIService.setLoading(true);
  //     const promises = itemsToUpload.map((item) => {
  //       return createDocument("items", item);
  //     });
  //     await Promise.all(promises);
  //     GlobalUIService.setLoading(false);
  //   } catch (error) {
  //     console.log("🚀 ~ handleUpload ~ error:", error);
  //     GlobalUIService.setLoading(false);
  //   }
  // };

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
          Add Client
        </Button>
      </Stack>

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
