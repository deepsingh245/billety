import { Button, Grid, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import { APP_CONSTANTS } from "../../constants/app.constants";
import { getAllDocuments } from "../../firebase/firebaseUtils";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { handleError } from "../../utils/error.utils";
import InvoiceDialog from "./InvoiceDialog";

// const invoice = [
//   {
//     amount: 1200,
//     balance: 1200,
//     customerName: "Alice Johnson",
//     customerId: "client001",
//     date: "2025-05-01",
//     duedate: "2025-06-01",
//     invoiceLink: "https://invoices.example.com/INV-1001",
//     orderNumber: "INV-1001",
//     status: "Unpaid",
//   },
const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 70 },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "phoneNumber",
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

const Invoices = () => {
  const [invoices, setInvoices] = useState(invoicesDummy);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    GlobalUIService.setLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAllDocuments(APP_CONSTANTS.COLLECTIONS.INVOICES);
        console.log("🚀 ~ fetchInvoices ~ data:", data);
        // setInvoices(data);
      } catch (error) {
        handleError(error, "Error fetching invoices");
      }
    };

    fetchInvoices();
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
          Invoices
        </Typography>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ width: "fit-content" }}
        >
          Add Invoice
        </Button>
      </Stack>

      <InvoiceDialog
        open={open}
        onClose={handleClose}
        title="Add Invoice"
      />
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid columns={columns} rows={invoices} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Invoices;

export const invoicesDummy = [
  {
    id: "Aarav Sharma",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phoneNumber: "+91 6366016482",
    company: "TechNova",
    receivables: "₹44,325",
  },
  {
    id: "Isha Mehta",
    name: "Isha Mehta",
    email: "isha.mehta@example.com",
    phoneNumber: "+91 7986681141",
    company: "InnoSoft",
    receivables: "₹158,383",
  },
  {
    id: "Kabir Singh",
    name: "Kabir Singh",
    email: "kabir.singh@example.com",
    phoneNumber: "+91 7703012738",
    company: "CodeSphere",
    receivables: "₹102,965",
  },
  {
    id: "Diya Kapoor",
    name: "Diya Kapoor",
    email: "diya.kapoor@example.com",
    phoneNumber: "+91 6480565001",
    company: "NextGen Labs",
    receivables: "₹120,011",
  },
  {
    id: "Rohan Patel",
    name: "Rohan Patel",
    email: "rohan.patel@example.com",
    phoneNumber: "+91 7273693529",
    company: "DataWave",
    receivables: "₹71,630",
  },
  {
    id: "Ananya Iyer",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phoneNumber: "+91 7749765222",
    company: "Cloudify",
    receivables: "₹92,331",
  },
  {
    id: "Aditya Verma",
    name: "Aditya Verma",
    email: "aditya.verma@example.com",
    phoneNumber: "+91 6847534591",
    company: "PixelWorks",
    receivables: "₹44,766",
  },
  {
    id: "Sanya Gupta",
    name: "Sanya Gupta",
    email: "sanya.gupta@example.com",
    phoneNumber: "+91 6233384250",
    company: "Quantum Solutions",
    receivables: "₹69,388",
  },
  {
    id: "Vihaan Reddy",
    name: "Vihaan Reddy",
    email: "vihaan.reddy@example.com",
    phoneNumber: "+91 7545753740",
    company: "BrightPath",
    receivables: "₹20,644",
  },
  {
    id: "Meera Nair",
    name: "Meera Nair",
    email: "meera.nair@example.com",
    phoneNumber: "+91 6017204493",
    company: "Visionary Systems",
    receivables: "₹111,169",
  },
  {
    id: "Aryan Joshi",
    name: "Aryan Joshi",
    email: "aryan.joshi@example.com",
    phoneNumber: "+91 8132711097",
    company: "InfoEdge",
    receivables: "₹130,918",
  },
  {
    id: "Kavya Bansal",
    name: "Kavya Bansal",
    email: "kavya.bansal@example.com",
    phoneNumber: "+91 6678081031",
    company: "MindCraft",
    receivables: "₹186,333",
  },
  {
    id: "Yash Malhotra",
    name: "Yash Malhotra",
    email: "yash.malhotra@example.com",
    phoneNumber: "+91 8452406310",
    company: "FutureSoft",
    receivables: "₹155,139",
  },
  {
    id: "Ria Deshmukh",
    name: "Ria Deshmukh",
    email: "ria.deshmukh@example.com",
    phoneNumber: "+91 8296705203",
    company: "CoreLogic",
    receivables: "₹187,717",
  },
  {
    id: "Nikhil Saxena",
    name: "Nikhil Saxena",
    email: "nikhil.saxena@example.com",
    phoneNumber: "+91 9230102201",
    company: "BlueSky Technologies",
    receivables: "₹40,180",
  },
  {
    id: "Tanvi Chawla",
    name: "Tanvi Chawla",
    email: "tanvi.chawla@example.com",
    phoneNumber: "+91 6447277469",
    company: "SmartEdge",
    receivables: "₹26,374",
  },
  {
    id: "Arjun Khanna",
    name: "Arjun Khanna",
    email: "arjun.khanna@example.com",
    phoneNumber: "+91 8852868835",
    company: "AlphaTech",
    receivables: "₹124,271",
  },
  {
    id: "Simran Kaur",
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    phoneNumber: "+91 8485130588",
    company: "SoftLink",
    receivables: "₹25,120",
  },
  {
    id: "Devansh Pandey",
    name: "Devansh Pandey",
    email: "devansh.pandey@example.com",
    phoneNumber: "+91 9659363154",
    company: "Digitech",
    receivables: "₹113,821",
  },
  {
    id: "Pooja Kulkarni",
    name: "Pooja Kulkarni",
    email: "pooja.kulkarni@example.com",
    phoneNumber: "+91 8516391392",
    company: "NeuraSoft",
    receivables: "₹114,794",
  },
];
