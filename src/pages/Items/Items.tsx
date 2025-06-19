import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";

const items = [
  {
    id: "item001",
    name: "Mild Steel Rod",
    category: "Construction",
    ratePerKg: 68,
    ratePerPiece: null,
    unit: "kg",
    description: "High-strength mild steel rods for structural work",
  },
  {
    id: "item002",
    name: "Cement Bag (50kg)",
    category: "Construction",
    ratePerKg: 8.5,
    ratePerPiece: 425,
    unit: "piece",
    description: "Standard cement for concrete and masonry work",
  },
  {
    id: "item003",
    name: "PVC Pipe (1 inch)",
    category: "Plumbing",
    ratePerKg: 125,
    ratePerPiece: 90,
    unit: "piece",
    description: "Durable PVC pipe for water supply",
  },
  {
    id: "item004",
    name: "Electrical Wire (90m coil)",
    category: "Electrical",
    ratePerKg: 540,
    ratePerPiece: 1200,
    unit: "piece",
    description: "ISI-marked copper wire for household wiring",
  },
  {
    id: "item005",
    name: "Ceramic Tile (12x12 inch)",
    category: "Flooring",
    ratePerKg: null,
    ratePerPiece: 40,
    unit: "piece",
    description: "Glossy finish floor tile",
  },
  {
    id: "item006",
    name: "Sand (River)",
    category: "Raw Material",
    ratePerKg: 1.5,
    ratePerPiece: null,
    unit: "kg",
    description: "Fine quality river sand for construction",
  },
  {
    id: "item007",
    name: "Bricks",
    category: "Construction",
    ratePerKg: null,
    ratePerPiece: 6.5,
    unit: "piece",
    description: "Red clay bricks",
  },
  {
    id: "item008",
    name: "Paint (White, 10L)",
    category: "Finishing",
    ratePerKg: 115,
    ratePerPiece: 1150,
    unit: "piece",
    description: "Interior emulsion white paint",
  },
  {
    id: "item009",
    name: "Granite Slab (per sq. ft.)",
    category: "Flooring",
    ratePerKg: null,
    ratePerPiece: 80,
    unit: "piece",
    description: "Black galaxy granite slab",
  },
  {
    id: "item010",
    name: "Stainless Steel Screws (100 pcs)",
    category: "Hardware",
    ratePerKg: 150,
    ratePerPiece: 120,
    unit: "piece",
    description: "Anti-rust screws for multiple uses",
  },
  {
    id: "item011",
    name: "Angle Iron (L-section)",
    category: "Construction",
    ratePerKg: 76,
    ratePerPiece: null,
    unit: "kg",
    description: "Steel angle used in fabrication",
  },
  {
    id: "item012",
    name: "Gypsum Board",
    category: "False Ceiling",
    ratePerKg: null,
    ratePerPiece: 350,
    unit: "piece",
    description: "Lightweight board for ceiling works",
  },
  {
    id: "item013",
    name: "Aluminium Window Frame",
    category: "Fixtures",
    ratePerKg: 210,
    ratePerPiece: 1800,
    unit: "piece",
    description: "Sliding window frame (standard size)",
  },
  {
    id: "item014",
    name: "Glass Pane (3x4 ft)",
    category: "Glass Work",
    ratePerKg: 95,
    ratePerPiece: 480,
    unit: "piece",
    description: "Tempered glass pane",
  },
  {
    id: "item015",
    name: "Wooden Door (Teak)",
    category: "Carpentry",
    ratePerKg: null,
    ratePerPiece: 5500,
    unit: "piece",
    description: "Solid teak wood door",
  },
  {
    id: "item016",
    name: "PVC Fittings (Set)",
    category: "Plumbing",
    ratePerKg: 180,
    ratePerPiece: 350,
    unit: "piece",
    description: "Pipe bends, joints, elbows - 20 pcs set",
  },
  {
    id: "item017",
    name: "Steel Plate (10mm)",
    category: "Fabrication",
    ratePerKg: 72,
    ratePerPiece: null,
    unit: "kg",
    description: "Used in heavy structures",
  },
  {
    id: "item018",
    name: "Plastic Water Tank (1000L)",
    category: "Plumbing",
    ratePerKg: 105,
    ratePerPiece: 5500,
    unit: "piece",
    description: "ISI-marked 5-layer tank",
  },
  {
    id: "item019",
    name: "Marble Slab (White Makrana)",
    category: "Flooring",
    ratePerKg: null,
    ratePerPiece: 95,
    unit: "piece",
    description: "Polished marble slab per sq. ft.",
  },
  {
    id: "item020",
    name: "Welding Rods (5kg Pack)",
    category: "Fabrication",
    ratePerKg: 85,
    ratePerPiece: 425,
    unit: "piece",
    description: "Standard welding rods for MS work",
  },
  {
    id: "item021",
    name: "Door Hinges (Pack of 2)",
    category: "Hardware",
    ratePerKg: 190,
    ratePerPiece: 60,
    unit: "piece",
    description: "Stainless steel hinges",
  },
  {
    id: "item022",
    name: "Putty (20kg bag)",
    category: "Finishing",
    ratePerKg: 23,
    ratePerPiece: 460,
    unit: "piece",
    description: "Smooth wall finishing putty",
  },
  {
    id: "item023",
    name: "LED Tube Light (4 ft)",
    category: "Electrical",
    ratePerKg: null,
    ratePerPiece: 280,
    unit: "piece",
    description: "Energy-efficient LED tube",
  },
  {
    id: "item024",
    name: "Switch Board (4-module)",
    category: "Electrical",
    ratePerKg: null,
    ratePerPiece: 210,
    unit: "piece",
    description: "Modular plastic switch board",
  },
  {
    id: "item025",
    name: "Bitumen Sheet",
    category: "Roofing",
    ratePerKg: 95,
    ratePerPiece: null,
    unit: "kg",
    description: "Waterproofing sheet for roofs",
  },
  {
    id: "item026",
    name: "TMT Bars (12mm)",
    category: "Construction",
    ratePerKg: 72,
    ratePerPiece: null,
    unit: "kg",
    description: "Thermo-mechanically treated steel bars",
  },
  {
    id: "item027",
    name: "Paint Roller",
    category: "Tools",
    ratePerKg: null,
    ratePerPiece: 150,
    unit: "piece",
    description: "Smooth finish wall roller",
  },
  {
    id: "item028",
    name: "Nails (1kg pack)",
    category: "Hardware",
    ratePerKg: 110,
    ratePerPiece: 110,
    unit: "piece",
    description: "Iron nails, assorted sizes",
  },
  {
    id: "item029",
    name: "Silicone Sealant",
    category: "Finishing",
    ratePerKg: 360,
    ratePerPiece: 180,
    unit: "piece",
    description: "Waterproof sealing for tiles and glass",
  },
  {
    id: "item030",
    name: "Wire Mesh (Roll)",
    category: "Fencing",
    ratePerKg: 60,
    ratePerPiece: 950,
    unit: "piece",
    description: "Galvanized wire mesh roll for fencing",
  },
];

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
  return (
    <Stack width={"100%"}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
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
