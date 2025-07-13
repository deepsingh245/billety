import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AddClientForm from "../../components/AddClientForm/AddClientForm";
import { colorSchemes } from "../../shared/themePrimitives";
import { getAllDocuments } from "../../firebase/firebaseUtils";
import { GlobalUIService } from "../../utils/GlobalUIService";

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
  const [clients, setClients] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchClients = async () => {
      GlobalUIService.setLoading(true);
      try {
        const data = await getAllDocuments("clients");
        console.log("🚀 ~ fetchClients ~ data:", data);
        setClients(data);
        GlobalUIService.setLoading(false);
      } catch (error) {
        GlobalUIService.setLoading(false);
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
          Add Client
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
            <AddClientForm />
          </Box>
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid columns={columns} rows={clients} />
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
