import { Router } from 'express';
import { handleFileUpload, handleFileDownload } from './FileIO.service';


const FileIO: Router = Router();

// Route for file upload
FileIO.post('/upload', handleFileUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded: ${req.file.originalname}`);
});

// Route for file download
FileIO.get('/download/:filename',
    handleFileDownload
);

export default FileIO;