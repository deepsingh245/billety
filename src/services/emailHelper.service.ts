/**
 * Email Utility Helper Functions
 * Simplified functions to send various types of emails
 */

import { Invoice } from "../interfaces/invoice.interface";
import { sendEmailWithAttachmentFromClient, sendEmailFromClient } from "./emailClient.service";
import { getEmailTemplate } from "./emailTemplates.service";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Send invoice email with PDF attachment
 * @param invoice - Invoice object
 * @param recipientEmail - Recipient email address
 * @param invoiceElement - HTML element containing invoice (for PDF generation)
 * @param appName - Application name (default: "Billety")
 */
export const sendInvoiceEmailWithPDF = async (
  invoice: Invoice,
  recipientEmail: string,
  invoiceElement: HTMLElement,
  appName: string = "Billety"
) => {
  try {
    // Generate PDF from HTML element
    const canvas = await html2canvas(invoiceElement, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    const pdfBase64 = pdf.output('dataurlstring').split(',')[1];

    // Get email template
    const emailBody = getEmailTemplate('invoice', invoice, appName);

    // Send email with attachment
    return await sendEmailWithAttachmentFromClient(
      recipientEmail,
      `Invoice #${invoice.id?.substring(0, 8).toUpperCase()} from ${appName}`,
      emailBody,
      {
        filename: `Invoice-${invoice.id?.substring(0, 8).toUpperCase()}.pdf`,
        content: pdfBase64,
        type: 'application/pdf'
      }
    );
  } catch (error) {
    console.error("Error sending invoice email with PDF:", error);
    throw error;
  }
};

/**
 * Send payment reminder email
 * @param invoice - Invoice object
 * @param recipientEmail - Recipient email address
 * @param appName - Application name (default: "Billety")
 */
export const sendPaymentReminderEmail = async (
  invoice: Invoice,
  recipientEmail: string,
  appName: string = "Billety"
) => {
  try {
    const emailBody = getEmailTemplate('payment-reminder', invoice, appName);

    return await sendEmailFromClient(
      recipientEmail,
      `Payment Reminder: Invoice #${invoice.id?.substring(0, 8).toUpperCase()} from ${appName}`,
      emailBody
    );
  } catch (error) {
    console.error("Error sending payment reminder email:", error);
    throw error;
  }
};

/**
 * Send payment confirmation email
 * @param invoice - Invoice object
 * @param recipientEmail - Recipient email address
 * @param appName - Application name (default: "Billety")
 */
export const sendPaymentConfirmationEmail = async (
  invoice: Invoice,
  recipientEmail: string,
  appName: string = "Billety"
) => {
  try {
    const emailBody = getEmailTemplate('payment-confirmation', invoice, appName);

    return await sendEmailFromClient(
      recipientEmail,
      `Payment Received: Invoice #${invoice.id?.substring(0, 8).toUpperCase()} from ${appName}`,
      emailBody
    );
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    throw error;
  }
};

/**
 * Send invoice cancelled email
 * @param invoice - Invoice object
 * @param recipientEmail - Recipient email address
 * @param reason - Cancellation reason
 * @param appName - Application name (default: "Billety")
 */
export const sendInvoiceCancelledEmail = async (
  invoice: Invoice,
  recipientEmail: string,
  reason: string = "Invoice cancelled per request",
  appName: string = "Billety"
) => {
  try {
    const emailBody = getEmailTemplate('cancelled', invoice, appName, reason);

    return await sendEmailFromClient(
      recipientEmail,
      `Invoice Cancelled: Invoice #${invoice.id?.substring(0, 8).toUpperCase()} from ${appName}`,
      emailBody
    );
  } catch (error) {
    console.error("Error sending invoice cancelled email:", error);
    throw error;
  }
};

/**
 * Send custom email (use your own template)
 * @param recipientEmail - Recipient email address
 * @param subject - Email subject
 * @param htmlBody - HTML email body
 * @param attachment - (Optional) File attachment {filename, content (base64), type}
 */
export const sendCustomEmail = async (
  recipientEmail: string,
  subject: string,
  htmlBody: string,
  attachment?: { filename: string; content: string; type: string }
) => {
  try {
    if (attachment) {
      return await sendEmailWithAttachmentFromClient(
        recipientEmail,
        subject,
        htmlBody,
        attachment
      );
    } else {
      return await sendEmailFromClient(
        recipientEmail,
        subject,
        htmlBody
      );
    }
  } catch (error) {
    console.error("Error sending custom email:", error);
    throw error;
  }
};

export default {
  sendInvoiceEmailWithPDF,
  sendPaymentReminderEmail,
  sendPaymentConfirmationEmail,
  sendInvoiceCancelledEmail,
  sendCustomEmail,
};
