/**
 * SendGrid Email Cloud Function
 * HTTP endpoint to send emails from the client
 * 
 * Usage:
 * Call: POST /sendEmail
 * Body: {
 *   "to": "recipient@example.com",
 *   "subject": "Email Subject",
 *   "body": "<h1>HTML Body</h1>"
 * }
 */

const {onRequest} = require("firebase-functions/v2/https");
const {endsWith} = require("firebase-functions");
const {sendEmail, sendEmailWithAttachment, sendEmailBulk} = require("./emailService");

/**
 * HTTP Cloud Function to send a simple email
 */
exports.sendEmail = onRequest(async (request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const {to, subject, body, fromEmail} = request.body;

    // Validate required fields
    if (!to || !subject || !body) {
      return response.status(400).json({
        error: "Missing required fields: to, subject, body",
      });
    }

    // Verify user is authenticated
    const authToken = request.headers.authorization;
    if (!authToken) {
      return response.status(401).json({
        error: "Unauthorized: Authentication token required",
      });
    }

    // Send email
    await sendEmail(to, subject, body, fromEmail);

    response.status(200).json({
      success: true,
      message: `Email sent successfully to ${to}`,
    });
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    response.status(500).json({
      error: "Failed to send email",
      message: error.message,
    });
  }
});

/**
 * HTTP Cloud Function to send email with attachment
 */
exports.sendEmailWithAttachment = onRequest(async (request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const {to, subject, body, attachment, fromEmail} = request.body;

    // Validate required fields
    if (!to || !subject || !body || !attachment) {
      return response.status(400).json({
        error: "Missing required fields: to, subject, body, attachment",
      });
    }

    // Verify user is authenticated
    const authToken = request.headers.authorization;
    if (!authToken) {
      return response.status(401).json({
        error: "Unauthorized: Authentication token required",
      });
    }

    // Send email with attachment
    await sendEmailWithAttachment(to, subject, body, attachment, fromEmail);

    response.status(200).json({
      success: true,
      message: `Email with attachment sent successfully to ${to}`,
    });
  } catch (error) {
    console.error("Error in sendEmailWithAttachment function:", error);
    response.status(500).json({
      error: "Failed to send email with attachment",
      message: error.message,
    });
  }
});

/**
 * HTTP Cloud Function to send bulk emails
 */
exports.sendEmailBulk = onRequest(async (request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const {recipients, subject, body, fromEmail} = request.body;

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject || !body) {
      return response.status(400).json({
        error: "Missing required fields: recipients (array), subject, body",
      });
    }

    // Verify user is authenticated
    const authToken = request.headers.authorization;
    if (!authToken) {
      return response.status(401).json({
        error: "Unauthorized: Authentication token required",
      });
    }

    // Send bulk emails
    await sendEmailBulk(recipients, subject, body, fromEmail);

    response.status(200).json({
      success: true,
      message: `Email sent successfully to ${recipients.length} recipients`,
    });
  } catch (error) {
    console.error("Error in sendEmailBulk function:", error);
    response.status(500).json({
      error: "Failed to send bulk emails",
      message: error.message,
    });
  }
});
