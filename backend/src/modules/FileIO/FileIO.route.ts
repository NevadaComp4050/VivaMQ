import { Router } from 'express';
import multer from 'multer';
import Controller from './FileIO.controller';
import { verifyAuthToken } from '@/middlewares/auth';

const FileIO: Router = Router();
const upload = multer();
const controller = new Controller();

/**
 * POST /file/upload
 * @summary Route for file upload
 * @tags File I/O
 * @param {} request.body.required
 * @return {} 
 */
FileIO.post(
  '/upload',
  verifyAuthToken,
  controller.handleFileUpload,
  (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded: ${req.file.originalname}`);
  }
);

/**
 * GET /file/download
 * @summary Route for file download
 * @tags File I/O
 * @param None
 * @return {} - return file
 */
FileIO.get(
  '/download/:filename',
  verifyAuthToken,
  controller.handleFileDownload
);

// Delete

export default FileIO;