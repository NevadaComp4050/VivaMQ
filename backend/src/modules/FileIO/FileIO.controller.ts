import { type NextFunction, type Response,type Request } from 'express';
//import { type User, Role } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UploadService from './FileIO.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

import multer from 'multer';
import path from 'path';
import fs from 'fs';


export default class FileIOController extends Api {
  private readonly UploadService = new UploadService();

  
  //private readonly filedir = '../uploads';

  // Route for file upload
  /*
  FileIO.post('/upload', handleFileUpload, (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded: ${req.file.originalname}`);
  });
  */

  // Configure multer
  /*
  private readonly storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
  });

  private readonly upload = multer({ this.storage });
  public handleFileUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    upload.single('file');
  }
  */
  
  /*
  public handleFileUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filename = req.params.filename
      // Consider forcing this directory to exist
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
          res.download(filePath);
      } else {
          res.status(404).send('File not found.');
      }
    } catch (e) {
        next(e);
    }
  };
  */
  // Route for file download
  /*
  FileIO.get('/download/:filename',
      handleFileDownload
  );
  */

  // Begin GPT BLOCK

  private readonly uploadDir = path.join(__dirname, '../uploads');

  // Ensure the directory exists
  constructor() {
    super();
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Configure multer
  private readonly storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  private readonly upload = multer({ storage: this.storage });

  public handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
    this.upload.single('file')(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  }

  // End GPT BLOCK


  public handleFileDownload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filename = req.params.filename
      // Consider forcing this directory to exist
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
          res.download(filePath);
      } else {
          res.status(404).send('File not found.');
      }
    } catch (e) {
        next(e);
    }
  }
}