import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Stack from "@mui/material/Stack";

const invoice = [
  {
    amount: 1200,
    balance: 1200,
    customerName: "Alice Johnson",
    customerId: "client001",
    date: "2025-05-01",
    duedate: "2025-06-01",
    invoiceLink: "https://invoices.example.com/INV-1001",
    orderNumber: "INV-1001",
    status: "Unpaid",
  },
  {
    amount: 1450,
    balance: 0,
    customerName: "Brian Lee",
    customerId: "client002",
    date: "2025-04-15",
    duedate: "2025-05-15",
    invoiceLink: "https://invoices.example.com/INV-1002",
    orderNumber: "INV-1002",
    status: "Paid",
  },
  {
    amount: 4000,
    balance: 4000,
    customerName: "Carla Gomez",
    customerId: "client003",
    date: "2025-06-01",
    duedate: "2025-07-01",
    invoiceLink: "https://invoices.example.com/INV-1003",
    orderNumber: "INV-1003",
    status: "Unpaid",
  },
  {
    amount: 3000,
    balance: 2600,
    customerName: "David Singh",
    customerId: "client004",
    date: "2025-05-20",
    duedate: "2025-06-20",
    invoiceLink: "https://invoices.example.com/INV-1004",
    orderNumber: "INV-1004",
    status: "Partially Paid",
  },
  {
    amount: 2200,
    balance: 2200,
    customerName: "Eva Chen",
    customerId: "client005",
    date: "2025-06-05",
    duedate: "2025-07-05",
    invoiceLink: "https://invoices.example.com/INV-1005",
    orderNumber: "INV-1005",
    status: "Unpaid",
  },
  {
    amount: 1500,
    balance: 0,
    customerName: "Frank Brown",
    customerId: "client006",
    date: "2025-05-10",
    duedate: "2025-06-10",
    invoiceLink: "https://invoices.example.com/INV-1006",
    orderNumber: "INV-1006",
    status: "Paid",
  },
  {
    amount: 4700,
    balance: 4700,
    customerName: "Grace Kim",
    customerId: "client007",
    date: "2025-06-01",
    duedate: "2025-07-01",
    invoiceLink: "https://invoices.example.com/INV-1007",
    orderNumber: "INV-1007",
    status: "Unpaid",
  },
  {
    amount: 6100,
    balance: 6100,
    customerName: "Henry Wilson",
    customerId: "client008",
    date: "2025-06-10",
    duedate: "2025-07-10",
    invoiceLink: "https://invoices.example.com/INV-1008",
    orderNumber: "INV-1008",
    status: "Unpaid",
  },
  {
    amount: 2750,
    balance: 0,
    customerName: "Isabella Rivera",
    customerId: "client009",
    date: "2025-05-15",
    duedate: "2025-06-15",
    invoiceLink: "https://invoices.example.com/INV-1009",
    orderNumber: "INV-1009",
    status: "Paid",
  },
  {
    amount: 4300,
    balance: 4300,
    customerName: "James Carter",
    customerId: "client010",
    date: "2025-06-01",
    duedate: "2025-07-01",
    invoiceLink: "https://invoices.example.com/INV-1010",
    orderNumber: "INV-1010",
    status: "Unpaid",
  },
];

function Invoices() {
  return (
    <Stack width={"100%"}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>{/* <CustomizedDataGrid /> */}</Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            {/* <CustomizedTreeView /> */}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Invoices;
