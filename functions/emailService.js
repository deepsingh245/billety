/**
 * SendGrid Email Service
 * Simple email sending utility using SendGrid
 */

const sgMail = require("@sendgrid/mail");

// Initialize SendGrid with API key from environment variables
const initializeEmailService = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.error("SENDGRID_API_KEY is not set in environment variables");
    throw new Error("SendGrid API key is missing");
  }
  
  sgMail.setApiKey(apiKey);
};

/**
 * Send a simple email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML)
 * @param {string} fromEmail - Sender email (optional, uses default if not provided)
 * @returns {Promise<boolean>} - Returns true if email sent successfully
 */
const sendEmail = async (to, subject, body, fromEmail = process.env.SENDGRID_FROM_EMAIL) => {
  try {
    initializeEmailService();

    if (!to || !subject || !body) {
      throw new Error("Missing required parameters: to, subject, body");
    }

    if (!fromEmail) {
      throw new Error("SENDGRID_FROM_EMAIL is not set in environment variables");
    }

    const message = {
      to: to,
      from: fromEmail,
      subject: subject,
      html: body,
    };

    await sgMail.send(message);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Send email with attachment
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML)
 * @param {object} attachment - Attachment object {filename, content, type}
 * @param {string} fromEmail - Sender email (optional)
 * @returns {Promise<boolean>} - Returns true if email sent successfully
 */
const sendEmailWithAttachment = async (to, subject, body, attachment, fromEmail = process.env.SENDGRID_FROM_EMAIL) => {
  try {
    initializeEmailService();

    if (!to || !subject || !body || !attachment) {
      throw new Error("Missing required parameters");
    }

    if (!fromEmail) {
      throw new Error("SENDGRID_FROM_EMAIL is not set in environment variables");
    }

    const message = {
      to: to,
      from: fromEmail,
      subject: subject,
      html: body,
      attachments: [
        {
          filename: attachment.filename,
          content: attachment.content,
          type: attachment.type,
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(message);
    console.log(`Email with attachment sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email with attachment:", error);
    throw error;
  }
};

/**
 * Send emails to multiple recipients
 * @param {array} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML)
 * @param {string} fromEmail - Sender email (optional)
 * @returns {Promise<boolean>} - Returns true if all emails sent successfully
 */
const sendEmailBulk = async (recipients, subject, body, fromEmail = process.env.SENDGRID_FROM_EMAIL) => {
  try {
    initializeEmailService();

    if (!recipients || recipients.length === 0 || !subject || !body) {
      throw new Error("Missing required parameters");
    }

    if (!fromEmail) {
      throw new Error("SENDGRID_FROM_EMAIL is not set in environment variables");
    }

    const message = {
      to: recipients,
      from: fromEmail,
      subject: subject,
      html: body,
    };

    await sgMail.send(message);
    console.log(`Email sent successfully to ${recipients.length} recipients`);
    return true;
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendEmailWithAttachment,
  sendEmailBulk,
  initializeEmailService,
};
