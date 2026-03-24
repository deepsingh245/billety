/**
 * Firebase Cloud Functions Index
 * Main entry point that exports all Cloud Functions
 */

// Import email endpoints
const {
  sendEmail,
  sendEmailWithAttachment,
  sendEmailBulk,
} = require("./emailEndpoints");

// Export all functions
module.exports = {
  sendEmail,
  sendEmailWithAttachment,
  sendEmailBulk,
};
