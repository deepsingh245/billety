// import { GlobalUIService } from "./GlobalUIService";

/**
 * Mock email service to send invoice to client.
 * In a real application, this would call a backend API or use EmailJS.
 */
export const sendInvoiceEmail = async (
    email: string,
    invoiceId: string,
    pdfBlob?: Blob
): Promise<boolean> => {
    console.log(`Sending email to ${email} for invoice ${invoiceId}`, pdfBlob);
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // In a real app, you would attach the PDF blob to the email request here.
            resolve(true);
        }, 1500);
    });
};
