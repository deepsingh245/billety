import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { GlobalUIService } from './GlobalUIService';

export const exportToPDF = async (elementId: string, fileName: string = 'document.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Handle images from other domains if any
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(fileName);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        GlobalUIService.showToast('Failed to generate PDF');
        return false;
    }
};
