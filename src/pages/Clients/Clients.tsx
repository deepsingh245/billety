import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridCellParams, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const clients = [
  {
    id: "client001",
    name: "Alice Johnson",
    email: "alice.johnson@techcorp.com",
    phone: "+1-555-0101",
    company: "TechCorp",
    receivables: 3200,
  },
  {
    id: "client002",
    name: "Brian Lee",
    email: "brian.lee@freshmedia.com",
    phone: "+1-555-0102",
    company: "Fresh Media",
    receivables: 1450,
  },
  {
    id: "client003",
    name: "Carla Gomez",
    email: "carla.gomez@greengrids.com",
    phone: "+1-555-0103",
    company: "Green Grids",
    receivables: 7800,
  },
  {
    id: "client004",
    name: "David Singh",
    email: "david.singh@buildsmart.com",
    phone: "+1-555-0104",
    company: "BuildSmart",
    receivables: 5600,
  },
  {
    id: "client005",
    name: "Eva Chen",
    email: "eva.chen@byteworks.io",
    phone: "+1-555-0105",
    company: "ByteWorks",
    receivables: 2200,
  },
  {
    id: "client006",
    name: "Frank Brown",
    email: "frank.brown@oceanview.com",
    phone: "+1-555-0106",
    company: "OceanView",
    receivables: 1500,
  },
  {
    id: "client007",
    name: "Grace Kim",
    email: "grace.kim@novaplan.com",
    phone: "+1-555-0107",
    company: "NovaPlan",
    receivables: 9400,
  },
  {
    id: "client008",
    name: "Henry Wilson",
    email: "henry.wilson@skyline.io",
    phone: "+1-555-0108",
    company: "Skyline Systems",
    receivables: 6100,
  },
  {
    id: "client009",
    name: "Isabella Rivera",
    email: "isabella.rivera@futurefit.com",
    phone: "+1-555-0109",
    company: "FutureFit",
    receivables: 2750,
  },
  {
    id: "client010",
    name: "James Carter",
    email: "james.carter@mountainpeak.com",
    phone: "+1-555-0110",
    company: "Mountain Peak Logistics",
    receivables: 4300,
  },
];

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

function Clients() {
  return (
    <Stack width={"100%"}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
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
}

export default Clients;
