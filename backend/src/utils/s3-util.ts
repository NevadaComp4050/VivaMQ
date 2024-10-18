/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import extractTextFromPdf from './extract-pdf-text';
import 'dotenv/config';

class S3PDFHandler {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    // Load bucket and region from environment variables
    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not defined');
    }
    this.bucketName = bucketName;
    const region = process.env.S3_REGION;
    if (!region) {
      throw new Error('S3_REGION environment variable is not defined');
    }

    this.s3Client = new S3Client({ region });
  }

  // Upload PDF file and extracted text to S3
  public async uploadPDFWithText(
    fileBuffer: Buffer,
    key: string,
    contentType: string = 'application/pdf'
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    };

    try {
      // Upload PDF file
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Extract text from the PDF
      const extractedText = await extractTextFromPdf(fileBuffer);

      // Upload the extracted text as a .txt file
      const textKey = key.replace(/\.pdf$/, '.txt');
      const textUploadParams = {
        Bucket: this.bucketName,
        Key: textKey,
        Body: extractedText,
        ContentType: 'text/plain',
      };
      await this.s3Client.send(new PutObjectCommand(textUploadParams));

      return `File and text uploaded successfully. PDF: ${key}, Text: ${textKey}`;
    } catch (error) {
      console.error('Error uploading PDF or text:', error);
      throw new Error('PDF or text upload failed');
    }
  }

  // Fetch PDF file from S3
  public async fetchPDF(key: string): Promise<Buffer> {
    const getParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const data = await this.s3Client.send(new GetObjectCommand(getParams));
      const stream = data.Body as Readable;
      return await this.streamToBuffer(stream);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      throw new Error('PDF fetch failed');
    }
  }

  // Fetch the uploaded text from a key
  public async fetchText(key: string): Promise<string> {
    const textKey = key.replace(/\.pdf$/, '.txt');
    const getParams = {
      Bucket: this.bucketName,
      Key: textKey,
    };

    try {
      const data = await this.s3Client.send(new GetObjectCommand(getParams));
      const stream = data.Body as Readable;
      const buffer = await this.streamToBuffer(stream);
      return buffer.toString('utf-8');
    } catch (error) {
      console.error('Error fetching text file:', error);
      throw new Error('Text fetch failed');
    }
  }

  // Helper method to convert stream to Buffer
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export default S3PDFHandler;
