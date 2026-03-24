# SendGrid Email Service Setup Guide

## Overview
This email service provides a simple way to send emails using SendGrid. It includes:
- **Backend Service** (`functions/emailService.js`) - Core SendGrid integration
- **Cloud Functions** (`functions/emailEndpoints.js`) - HTTP endpoints for client calls
- **Client Wrapper** (`src/services/emailClient.service.ts`) - Easy-to-use client-side functions

---

## Setup Instructions

### Step 1: Install Dependencies
Run npm install to install SendGrid:
```bash
npm install
```

### Step 2: Setup SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key from Settings → API Keys
3. Verify a sender email address (or domain)

### Step 3: Configure Environment Variables
Set up Firebase Cloud Functions environment variables:

```bash
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set sendgrid.from_email="noreply@yourbrand.com"
```

Or create a `.env.local` file in the functions folder:
```
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourbrand.com
```

### Step 4: Deploy Cloud Functions
```bash
firebase deploy --only functions
```

---

## Usage Examples

### Basic Email (from React)
```typescript
import { sendEmailFromClient } from "@/services/emailClient.service";

// In your component or handler
const handleSendEmail = async () => {
  try {
    await sendEmailFromClient(
      "user@example.com",
      "Welcome to Billety!",
      "<h1>Welcome</h1><p>Thank you for signing up!</p>"
    );
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
```

### Email with Invoice PDF Attachment
```typescript
import { sendEmailWithAttachmentFromClient } from "@/services/emailClient.service";

// After generating PDF with jsPDF/html2canvas
const handleSendInvoicePDF = async (pdfBlob, recipientEmail) => {
  try {
    // Convert PDF blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    
    reader.onloadend = async () => {
      const base64Content = reader.result.split(',')[1];
      
      await sendEmailWithAttachmentFromClient(
        recipientEmail,
        "Invoice #INV-2024-001",
        "<h1>Your Invoice</h1><p>Please find your invoice attached.</p>",
        {
          filename: "Invoice_2024_001.pdf",
          content: base64Content,
          type: "application/pdf"
        }
      );
    };
  } catch (error) {
    console.error("Failed to send invoice:", error);
  }
};
```

### Bulk Email to Multiple Recipients
```typescript
import { sendBulkEmailFromClient } from "@/services/emailClient.service";

const sendNewsletterToClients = async (clients) => {
  try {
    const recipientEmails = clients.map(client => client.email);
    
    await sendBulkEmailFromClient(
      recipientEmails,
      "Monthly Newsletter",
      `
        <h1>Monthly Newsletter</h1>
        <p>Here's what's new this month...</p>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      `
    );
    
    console.log("Newsletter sent to all clients!");
  } catch (error) {
    console.error("Failed to send newsletter:", error);
  }
};
```

### Backend Usage (Direct Service)
```javascript
const {sendEmail} = require("./emailService");

// Use directly in Cloud Functions
const result = await sendEmail(
  "user@example.com",
  "Subject Line",
  "<h1>HTML Body</h1>"
);
```

---

## API Documentation

### `sendEmailFromClient(to, subject, body, fromEmail?)`
Send a simple email from the React client.

**Parameters:**
- `to` (string) - Recipient email address
- `subject` (string) - Email subject
- `body` (string) - Email body in HTML format
- `fromEmail` (string, optional) - Sender email (uses SENDGRID_FROM_EMAIL if not provided)

**Returns:** Promise<object> - Success response with message

**Example:**
```typescript
await sendEmailFromClient(
  "client@example.com",
  "Invoice Ready",
  "<p>Your invoice is ready for download</p>"
);
```

---

### `sendEmailWithAttachmentFromClient(to, subject, body, attachment, fromEmail?)`
Send email with file attachment (e.g., PDF invoice).

**Parameters:**
- `to` (string) - Recipient email address
- `subject` (string) - Email subject
- `body` (string) - Email body in HTML format
- `attachment` (object) - Attachment object:
  - `filename` (string) - File name (e.g., "invoice.pdf")
  - `content` (string) - Base64 encoded file content
  - `type` (string) - MIME type (e.g., "application/pdf")
- `fromEmail` (string, optional) - Sender email

**Returns:** Promise<object> - Success response with message

**Example:**
```typescript
await sendEmailWithAttachmentFromClient(
  "client@example.com",
  "Invoice #123",
  "<p>Please find your invoice attached</p>",
  {
    filename: "invoice_123.pdf",
    content: "JVBERi0xLjQKJeLj...", // Base64 content
    type: "application/pdf"
  }
);
```

---

### `sendBulkEmailFromClient(recipients, subject, body, fromEmail?)`
Send email to multiple recipients.

**Parameters:**
- `recipients` (array) - Array of email addresses
- `subject` (string) - Email subject
- `body` (string) - Email body in HTML format
- `fromEmail` (string, optional) - Sender email

**Returns:** Promise<object> - Success response with count

**Example:**
```typescript
await sendBulkEmailFromClient(
  ["user1@example.com", "user2@example.com"],
  "Special Offer",
  "<h1>Limited Time Offer</h1><p>50% off this weekend!</p>"
);
```

---

## Integration Points

### Send Invoice Email to Client
Add to Invoice creation/completion:
```typescript
// In your invoice component
import { sendEmailWithAttachmentFromClient } from "@/services/emailClient.service";

const sendInvoiceToClient = async (invoice, clientEmail, pdfBlob) => {
  const reader = new FileReader();
  reader.readAsDataURL(pdfBlob);
  
  reader.onloadend = async () => {
    const base64 = reader.result.split(',')[1];
    
    await sendEmailWithAttachmentFromClient(
      clientEmail,
      `Invoice ${invoice.number}`,
      `<p>Dear Client,</p>
       <p>Your invoice ${invoice.number} is attached.</p>
       <p>Amount Due: ${invoice.totalAmount}</p>`,
      {
        filename: `Invoice_${invoice.number}.pdf`,
        content: base64,
        type: "application/pdf"
      }
    );
  };
};
```

### Send Password Reset Email
```typescript
// In your authentication service
const sendPasswordResetEmail = async (email) => {
  await sendEmailFromClient(
    email,
    "Reset Your Password",
    `<p>Click the link below to reset your password:</p>
     <p><a href="https://app.billety.com/reset?token=abc123">Reset Password</a></p>`
  );
};
```

### Send Welcome Email
```typescript
// After user signup
const sendWelcomeEmail = async (newUser) => {
  await sendEmailFromClient(
    newUser.email,
    "Welcome to Billety!",
    `<h1>Welcome ${newUser.name}!</h1>
     <p>Your account has been created successfully.</p>
     <p>Start creating invoices today!</p>`
  );
};
```

---

## Troubleshooting

### "SENDGRID_API_KEY is not set"
- Make sure you've configured the environment variables
- Run: `firebase functions:config:set sendgrid.api_key="YOUR_KEY"`

### "Email not sending from verified address"
- Your from email must be verified in SendGrid
- Go to Settings → Sender Authentication in SendGrid dashboard

### "401 Unauthorized"
- User must be authenticated to send emails
- Make sure user is logged in before calling

### "Email HTML rendering issues"
- Make sure HTML is properly formatted
- Test with simple HTML first, then add complexity

---

## Security Notes

✅ **Best Practices Included:**
- All email endpoints require Firebase authentication
- API key stored securely in Firebase Functions config
- No API key exposed to client-side code
- CORS headers configured
- Input validation on all endpoints

⚠️ **Never:**
- Expose SendGrid API key in frontend code
- Store credentials in version control
- Log sensitive email content
- Send to unverified email domains (without DKIM setup)

---

## File Structure
```
billety/
├── functions/
│   ├── emailService.js          ← Core SendGrid service
│   ├── emailEndpoints.js        ← Cloud Function HTTP endpoints
│   └── package.json             ← Includes @sendgrid/mail
├── src/
│   └── services/
│       └── emailClient.service.ts  ← Client wrapper
└── package.json                 ← Includes @sendgrid/mail
```

---

## Next Steps

1. ✅ Install npm packages: `npm install && cd functions && npm install`
2. ✅ Set up SendGrid API key and from email
3. ✅ Deploy: `firebase deploy --only functions`
4. ✅ Test with a simple email first
5. ✅ Integrate into invoice/client workflows

Ready to send emails! 🚀
