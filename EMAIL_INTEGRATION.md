# Email Service Implementation Guide

## Overview

The email service now includes:
1. **Email Templates** - Beautiful HTML email templates for different scenarios
2. **Cloud Functions** - Secure backend endpoints for sending emails
3. **Client-side Wrapper** - Easy-to-use functions in React
4. **Email Helper** - Simplified utilities for common email tasks
5. **Invoice Integration** - Automatic invoice sending with PDF attachment

---

## Features

### 📧 Email Templates Available

1. **Invoice Template** - Send invoice to client
   - Beautiful invoice summary
   - Line items with amounts
   - Total calculation
   - Invoice date and due date
   - Professional styling

2. **Payment Reminder Template** - Payment due soon/overdue
   - Highlighted overdue amount
   - Days overdue calculation
   - Professional reminder tone
   - Contact information

3. **Payment Confirmation Template** - Thankyou email after payment
   - Success indicator
   - Payment amount and date
   - Thank you message
   - Next steps

4. **Invoice Cancelled Template** - Notification of cancellation
   - Clear cancellation notice
   - Reason for cancellation
   - Action items
   - Support contact

---

## Usage Examples

### 1. Send Invoice with PDF Attachment (Automatic in Invoice Detail)

The invoice detail page now automatically:
- Generates a PDF from the invoice HTML
- Creates a professional email with the invoice template
- Attaches the PDF
- Sends to client
- Updates invoice status to "sent"

**Code Location:** `src/pages/Invoices/InvoiceDetail.tsx`

```typescript
// Already integrated! Just click "Send" button
const handleSendEmail = async () => {
  // Automatically generates PDF, creates email, sends with attachment
  // Updates invoice status to 'sent'
};
```

### 2. Send Payment Reminder Email

```typescript
import { sendPaymentReminderEmail } from "@/services/emailHelper.service";

// In your component/handler
const sendReminder = async (invoice: Invoice) => {
  try {
    await sendPaymentReminderEmail(
      invoice,
      invoice.client.email,
      "Billety"
    );
    console.log("Reminder sent!");
  } catch (error) {
    console.error("Failed to send reminder:", error);
  }
};
```

### 3. Send Payment Confirmation Email

```typescript
import { sendPaymentConfirmationEmail } from "@/services/emailHelper.service";

const confirmPayment = async (invoice: Invoice) => {
  try {
    await sendPaymentConfirmationEmail(
      invoice,
      invoice.client.email
    );
    console.log("Confirmation sent!");
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

### 4. Send Invoice Cancelled Email

```typescript
import { sendInvoiceCancelledEmail } from "@/services/emailHelper.service";

const cancelInvoice = async (invoice: Invoice) => {
  try {
    await sendInvoiceCancelledEmail(
      invoice,
      invoice.client.email,
      "Invoice cancelled - new quote coming soon"
    );
    console.log("Cancellation notice sent!");
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

### 5. Send Custom Email

```typescript
import { sendCustomEmail } from "@/services/emailHelper.service";

const sendCustomMessage = async () => {
  const htmlBody = `
    <h1>Custom Message</h1>
    <p>Your message here with HTML formatting</p>
  `;

  try {
    await sendCustomEmail(
      "client@example.com",
      "Custom Subject",
      htmlBody
    );
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

### 6. Send Email with Custom Attachment

```typescript
import { sendCustomEmail } from "@/services/emailHelper.service";

const sendWithCustomAttachment = async (fileBase64: string) => {
  try {
    await sendCustomEmail(
      "client@example.com",
      "Document",
      "<p>Please find the document attached.</p>",
      {
        filename: "document.pdf",
        content: fileBase64, // Base64 encoded content
        type: "application/pdf"
      }
    );
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

---

## File Structure

```
src/
├── services/
│   ├── emailClient.service.ts       ← Client wrapper for Cloud Functions
│   ├── emailTemplates.service.ts    ← HTML email templates
│   └── emailHelper.service.ts       ← Simplified helper functions
└── pages/
    └── Invoices/
        └── InvoiceDetail.tsx        ← Integrated invoice sending

functions/
├── emailService.js                  ← Core SendGrid service
├── emailEndpoints.js                ← Cloud Function HTTP endpoints
├── index.js                         ← Function exports
└── package.json                     ← Dependencies (includes @sendgrid/mail)
```

---

## Integration Points

### Invoice Sending (Already Done ✅)

When you click "Send" on an invoice:
1. PDF is generated from invoice HTML
2. Email body is created using template
3. PDF is attached to email
4. Email is sent via Cloud Function
5. Invoice status updated to "sent"

**Location:** `src/pages/Invoices/InvoiceDetail.tsx` line ~180

### Where to Add More Integrations

**Bulk Actions - Send to Multiple Clients:**
```typescript
// src/pages/Invoices/Invoices.tsx
const sendToMultipleClients = async (invoices: Invoice[]) => {
  for (const invoice of invoices) {
    const element = document.getElementById(`invoice-${invoice.id}`);
    await sendInvoiceEmailWithPDF(
      invoice,
      invoice.client.email,
      element!
    );
  }
};
```

**Dashboard - Automatic Reminders:**
```typescript
// src/pages/Home/Home.tsx
const checkOverdueInvoices = async () => {
  const overdueInvoices = invoices.filter(inv => {
    return new Date(inv.dueDate) < new Date() && inv.status !== 'paid';
  });

  for (const invoice of overdueInvoices) {
    await sendPaymentReminderEmail(invoice, invoice.client.email);
  }
};
```

**Admin Feature - Send Newsletter:**
```typescript
// src/pages/Clients/Clients.tsx
const sendNewsletter = async (clients: Client[]) => {
  const emailBody = `<h1>Monthly Update</h1><p>...</p>`;
  
  for (const client of clients) {
    await sendCustomEmail(client.email, "Newsletter", emailBody);
  }
};
```

---

## Template Customization

### Edit Email Templates

File: `src/services/emailTemplates.service.ts`

Each template function returns HTML string. Customize:
- Colors (gradients in `.header`)
- Company/app name
- Currency symbol
- Font and styling
- Content and messaging

Example:
```typescript
export const getInvoiceEmailTemplate = (invoice: Invoice, appName: string = "Billety") => {
  // Change colors here:
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  // Change text here:
  // <h1>${appName}</h1>
  
  // Add company logo:
  // <img src="https://your-domain.com/logo.png" />
};
```

---

## Cloud Function Configuration

### Environment Variables Required

Set these in Firebase:
```bash
firebase functions:config:set sendgrid.api_key="YOUR_API_KEY"
firebase functions:config:set sendgrid.from_email="noreply@yourbrand.com"
```

### Deploy Functions

```bash
firebase deploy --only functions
```

### Test Functions Locally

```bash
cd functions
npm run serve
```

Then call: `http://localhost:5001/your-project/us-central1/sendEmail`

---

## Error Handling

### Common Issues

**"SENDGRID_API_KEY is not set"**
- Configure Firebase environment variables
- Run: `firebase functions:config:set sendgrid.api_key="YOUR_KEY"`

**"Email not sending from verified address"**
- Verify sender email in SendGrid dashboard
- Settings → Sender Authentication

**"401 Unauthorized"**
- User must be logged in to Firebase Auth
- Check authentication context

**"Invoice preview not found"**
- Make sure invoice HTML element ID is "invoice-preview"
- Element must be rendered before sending

### Debug Mode

Add logging:
```typescript
try {
  await sendInvoiceEmailWithPDF(invoice, email, element);
} catch (error) {
  console.error("Full error:", error);
  console.error("Error details:", (error as any).response?.data);
}
```

---

## Security Notes

✅ **Implemented:**
- API key stored in Firebase (not exposed to client)
- CORS headers configured
- Authentication required
- Input validation
- No sensitive data in logs

⚠️ **Best Practices:**
- Never log user emails or sensitive info
- Use environment variables for API keys
- Test with verified email addresses
- Monitor API usage/costs
- Set rate limits if needed

---

## Testing

### Test with SendGrid Sandbox

```typescript
const testEmail = async () => {
  await sendCustomEmail(
    "test@example.com",
    "Test Email",
    "<h1>Test</h1><p>This is a test email</p>"
  );
};
```

### Check SendGrid Activity

1. Go to SendGrid Dashboard
2. Mail Activity → View recent sends
3. Check delivery status
4. View bounce/complaint reports

---

## Future Enhancements

### Suggested Features

1. **Schedule Emails** - Send invoices at specific time
2. **Email Templates UI** - Edit templates in app
3. **Email Logs** - Track all sent emails
4. **Retry Logic** - Automatic retry on failure
5. **Batch Sending** - Send to multiple clients
6. **Email Preview** - Preview before sending
7. **Unsubscribe Link** - Comply with regulations
8. **Email Analytics** - Track opens/clicks

---

## API Reference

### `sendInvoiceEmailWithPDF()`
```typescript
sendInvoiceEmailWithPDF(
  invoice: Invoice,
  recipientEmail: string,
  invoiceElement: HTMLElement,
  appName?: string
): Promise<object>
```

### `sendPaymentReminderEmail()`
```typescript
sendPaymentReminderEmail(
  invoice: Invoice,
  recipientEmail: string,
  appName?: string
): Promise<object>
```

### `sendPaymentConfirmationEmail()`
```typescript
sendPaymentConfirmationEmail(
  invoice: Invoice,
  recipientEmail: string,
  appName?: string
): Promise<object>
```

### `sendInvoiceCancelledEmail()`
```typescript
sendInvoiceCancelledEmail(
  invoice: Invoice,
  recipientEmail: string,
  reason?: string,
  appName?: string
): Promise<object>
```

### `sendCustomEmail()`
```typescript
sendCustomEmail(
  recipientEmail: string,
  subject: string,
  htmlBody: string,
  attachment?: {filename, content, type}
): Promise<object>
```

---

## Troubleshooting Checklist

- [ ] SendGrid API key configured
- [ ] From email address verified in SendGrid
- [ ] Firebase functions deployed
- [ ] User is authenticated (logged in)
- [ ] HTML email element has ID "invoice-preview"
- [ ] Browser console shows no errors
- [ ] SendGrid shows email in activity log
- [ ] Email arrives in recipient's mailbox

---

Ready to send emails! 🚀 Start with the invoice sending feature it's already integrated.
