import { Box } from "@mui/material";
import { Invoice } from "../../interfaces/invoice.interface";
import { INVOICE_TEMPLATES, DEFAULT_TEMPLATE_ID } from "./templates";

interface InvoicePDFProps {
  invoice: Invoice;
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  const templateId = invoice.templateId || DEFAULT_TEMPLATE_ID;
  const TemplateComponent = INVOICE_TEMPLATES[templateId]?.component || INVOICE_TEMPLATES[DEFAULT_TEMPLATE_ID].component;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <TemplateComponent invoice={invoice} />
    </Box>
  );
}
