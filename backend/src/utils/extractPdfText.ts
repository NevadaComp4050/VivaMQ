import fs from 'fs';
import pdfParse from 'pdf-parse';

async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
    try {
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        // Handle specific error scenarios if needed
        console.error('Error extracting text from PDF:', error);
        throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
}




export default extractTextFromPdf;