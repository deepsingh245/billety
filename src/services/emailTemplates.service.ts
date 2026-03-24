/**
 * Email Templates for different scenarios
 * HTML templates for various email communications
 */

import { Invoice } from "../../interfaces/invoice.interface";
import { CURRENCY } from "../../constants/app.constants";

/**
 * Generate HTML for invoice email
 */
export const getInvoiceEmailTemplate = (invoice: Invoice, appName: string = "Billety"): string => {
  const totalAmount = invoice.totalAmount || 0;
  const currency = "₹"; // Default currency, you can make this dynamic

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .invoice-number {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #667eea;
        }
        .client-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .client-info h3 {
          margin-top: 0;
          color: #667eea;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table thead {
          background-color: #f0f0f0;
        }
        .items-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #667eea;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        .items-table tr:last-child td {
          border-bottom: none;
        }
        .total-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          text-align: right;
          margin: 20px 0;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
        }
        .status-sent {
          background-color: #d4edda;
          color: #155724;
        }
        .status-draft {
          background-color: #fff3cd;
          color: #856404;
        }
        .cta-button {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 12px 30px;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
          font-weight: 600;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
        .due-date {
          color: #e74c3c;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${appName}</h1>
          <p>Invoice Notification</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${invoice.client?.name || "Valued Client"}</strong>,</p>
          
          <p>Your invoice has been generated and is ready for review. Please see the details below:</p>
          
          <div class="invoice-number">
            Invoice #${invoice.id?.substring(0, 8).toUpperCase() || "DRAFT"}
          </div>
          
          <div class="client-info">
            <h3>Client Information</h3>
            <p><strong>Company:</strong> ${invoice.client?.company || "N/A"}</p>
            <p><strong>Email:</strong> ${invoice.client?.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${invoice.client?.phone || "N/A"}</p>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items?.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${currency}${item.rate?.toFixed(2) || "0.00"}</td>
                  <td>${currency}${(item.quantity * item.rate)?.toFixed(2) || "0.00"}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          
          <div class="total-section">
            <div>Subtotal: <strong>${currency}${totalAmount.toFixed(2)}</strong></div>
            <div class="total-amount">Total: ${currency}${totalAmount.toFixed(2)}</div>
          </div>
          
          <div style="padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
            <strong>Invoice Date:</strong> ${new Date(invoice.date).toLocaleDateString()}<br>
            ${invoice.dueDate ? `<strong class="due-date">Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}` : ""}
          </div>
          
          <p style="margin-top: 20px;">Please find the detailed invoice attached to this email. If you have any questions or need adjustments, please don't hesitate to reach out.</p>
          
          <a href="mailto:support@${appName.toLowerCase()}.com" class="cta-button">
            Contact Us
          </a>
          
          <span class="status-badge status-${invoice.status}">
            Status: ${invoice.status?.toUpperCase() || "DRAFT"}
          </span>
        </div>
        
        <div class="footer">
          <p>© 2024 ${appName}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate HTML for payment reminder email
 */
export const getPaymentReminderEmailTemplate = (invoice: Invoice, appName: string = "Billety"): string => {
  const totalAmount = invoice.totalAmount || 0;
  const currency = "₹";
  const daysOverdue = invoice.dueDate ? Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .warning-banner {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning-banner strong {
          color: #856404;
        }
        .content {
          padding: 30px;
        }
        .invoice-number {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #f5576c;
        }
        .amount-display {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        }
        .amount-display .amount {
          font-size: 32px;
          font-weight: bold;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${appName}</h1>
          <p>Payment Reminder</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${invoice.client?.name || "Valued Client"}</strong>,</p>
          
          <div class="warning-banner">
            <strong>⚠️ Payment Reminder:</strong> Invoice #${invoice.id?.substring(0, 8).toUpperCase()} is overdue by ${daysOverdue} days.
          </div>
          
          <p>We noticed that payment for the following invoice has not been received yet:</p>
          
          <div class="invoice-number">
            Invoice #${invoice.id?.substring(0, 8).toUpperCase()}
          </div>
          
          <div class="amount-display">
            <p>Amount Due</p>
            <div class="amount">${currency}${totalAmount.toFixed(2)}</div>
            <p>Due Date: ${new Date(invoice.dueDate || invoice.date).toLocaleDateString()}</p>
          </div>
          
          <p>To avoid any inconvenience, please process the payment at your earliest convenience. If you have already made the payment, please disregard this notice and accept our thanks.</p>
          
          <p>If you have any questions regarding this invoice or need a payment arrangement, please contact us immediately.</p>
          
          <p style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
            <strong>Need Help?</strong><br>
            Contact our support team at support@${appName.toLowerCase()}.com<br>
            We're here to help!
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 ${appName}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate HTML for invoice paid confirmation email
 */
export const getPaymentConfirmationEmailTemplate = (invoice: Invoice, appName: string = "Billety"): string => {
  const totalAmount = invoice.totalAmount || 0;
  const currency = "₹";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .success-banner {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          color: #155724;
        }
        .content {
          padding: 30px;
        }
        .invoice-number {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #11998e;
        }
        .amount-display {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        }
        .amount-display .amount {
          font-size: 32px;
          font-weight: bold;
        }
        .thank-you {
          text-align: center;
          font-size: 18px;
          color: #11998e;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${appName}</h1>
          <p>✓ Payment Received</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${invoice.client?.name || "Valued Client"}</strong>,</p>
          
          <div class="success-banner">
            <strong>✓ Thank you!</strong> Your payment has been successfully received and processed.
          </div>
          
          <div class="invoice-number">
            Invoice #${invoice.id?.substring(0, 8).toUpperCase()}
          </div>
          
          <div class="amount-display">
            <p>Amount Paid</p>
            <div class="amount">${currency}${totalAmount.toFixed(2)}</div>
            <p>Payment Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="thank-you">
            Thank you for your prompt payment!
          </div>
          
          <p>We truly appreciate your business and timely payment. Your invoice has been marked as paid and closed.</p>
          
          <p style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
            <strong>Questions?</strong><br>
            If you need any documentation or have questions about your account, please contact us at support@${appName.toLowerCase()}.com
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 ${appName}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate HTML for invoice cancellation email
 */
export const getInvoiceCancelledEmailTemplate = (invoice: Invoice, reason: string = "Cancelled per client request", appName: string = "Billety"): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #a8a8a8 0%, #5a5a5a 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .info-banner {
          background-color: #e2e3e5;
          border-left: 4px solid #6c757d;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          color: #383d41;
        }
        .content {
          padding: 30px;
        }
        .invoice-number {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #5a5a5a;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${appName}</h1>
          <p>Invoice Cancelled</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${invoice.client?.name || "Valued Client"}</strong>,</p>
          
          <div class="info-banner">
            <strong>ℹ️ Notice:</strong> Invoice #${invoice.id?.substring(0, 8).toUpperCase()} has been cancelled.
          </div>
          
          <div class="invoice-number">
            Invoice #${invoice.id?.substring(0, 8).toUpperCase()}
          </div>
          
          <p><strong>Cancellation Reason:</strong> ${reason}</p>
          
          <p>This invoice is no longer valid and does not require any payment. Please disregard any previous billing communications related to this invoice.</p>
          
          <p>If you have any questions about this cancellation or need a revised invoice, please contact us immediately.</p>
          
          <p style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
            <strong>Need Assistance?</strong><br>
            Contact our support team at support@${appName.toLowerCase()}.com
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 ${appName}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export type EmailTemplateType = 'invoice' | 'payment-reminder' | 'payment-confirmation' | 'cancelled';

/**
 * Get email template based on type
 */
export const getEmailTemplate = (type: EmailTemplateType, invoice: Invoice, appName?: string, reason?: string): string => {
  switch (type) {
    case 'invoice':
      return getInvoiceEmailTemplate(invoice, appName);
    case 'payment-reminder':
      return getPaymentReminderEmailTemplate(invoice, appName);
    case 'payment-confirmation':
      return getPaymentConfirmationEmailTemplate(invoice, appName);
    case 'cancelled':
      return getInvoiceCancelledEmailTemplate(invoice, reason, appName);
    default:
      return getInvoiceEmailTemplate(invoice, appName);
  }
};
