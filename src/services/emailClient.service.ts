/**
 * Email Service Client Wrapper
 * Simple wrapper to call Cloud Functions for sending emails
 * 
 * Usage:
 * import { sendEmailFromClient } from "@/services/emailClient.service";
 * 
 * await sendEmailFromClient(
 *   "recipient@example.com",
 *   "Welcome!",
 *   "<h1>Hello</h1><p>Welcome to our app</p>"
 * );
 */

import { getFunctions, httpsCallable } from "firebase/functions";

/**
 * Send a simple email from client
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param body - Email body (HTML format)
 * @param fromEmail - (Optional) Sender email address
 * @returns Response from Cloud Function
 * 
 * @example
 * await sendEmailFromClient(
 *   "user@example.com",
 *   "Invoice #123",
 *   "<h1>Your Invoice</h1><p>Amount: $100</p>"
 * );
 */
export const sendEmailFromClient = async (
  to: string,
  subject: string,
  body: string,
  fromEmail?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const functions = getFunctions();
    const sendEmailFunction = httpsCallable(functions, "sendEmail");

    const result = await sendEmailFunction({
      to,
      subject,
      body,
      ...(fromEmail && { fromEmail }),
    });

    return result.data as { success: boolean; message: string };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

interface EmailAttachment {
  filename: string;
  content: string;
  type: string;
}

/**
 * Send email with attachment from client
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param body - Email body (HTML format)
 * @param attachment - Attachment object with filename, content (base64), and type
 * @param fromEmail - (Optional) Sender email address
 * @returns Response from Cloud Function
 * 
 * @example
 * await sendEmailWithAttachmentFromClient(
 *   "user@example.com",
 *   "Invoice #123",
 *   "<h1>Your Invoice</h1>",
 *   {
 *     filename: "invoice.pdf",
 *     content: base64Content,
 *     type: "application/pdf"
 *   }
 * );
 */
export const sendEmailWithAttachmentFromClient = async (
  to: string,
  subject: string,
  body: string,
  attachment: EmailAttachment,
  fromEmail?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const functions = getFunctions();
    const sendEmailWithAttachmentFunction = httpsCallable(functions, "sendEmailWithAttachment");

    const result = await sendEmailWithAttachmentFunction({
      to,
      subject,
      body,
      attachment,
      ...(fromEmail && { fromEmail }),
    });

    return result.data as { success: boolean; message: string };
  } catch (error) {
    console.error("Error sending email with attachment:", error);
    throw error;
  }
};

/**
 * Send bulk emails from client
 * 
 * @param recipients - Array of email addresses
 * @param subject - Email subject
 * @param body - Email body (HTML format)
 * @param fromEmail - (Optional) Sender email address
 * @returns Response from Cloud Function
 * 
 * @example
 * await sendBulkEmailFromClient(
 *   ["user1@example.com", "user2@example.com"],
 *   "Newsletter",
 *   "<h1>Monthly Newsletter</h1><p>Content here</p>"
 * );
 */
export const sendBulkEmailFromClient = async (
  recipients: string[],
  subject: string,
  body: string,
  fromEmail?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const functions = getFunctions();
    const sendBulkEmailFunction = httpsCallable(functions, "sendEmailBulk");

    const result = await sendBulkEmailFunction({
      recipients,
      subject,
      body,
      ...(fromEmail && { fromEmail }),
    });

    return result.data as { success: boolean; message: string };
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    throw error;
  }
};
