import { Router } from 'express';
import Controller from './FileIO.controller';
import { verifyAuthToken } from '@/middlewares/auth';

const FileIO: Router = Router();
const controller = new Controller();
// Route for file upload
/*
FileIO.post('/upload',
  Controller.handleFileUpload,
  (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded: ${req.file.originalname}`);
});
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

// Route for file download
FileIO.get(
  '/download/:filename',
  verifyAuthToken,
  controller.handleFileDownload
);

export default FileIO;