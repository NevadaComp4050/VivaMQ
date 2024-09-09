import { Router } from 'express';
import multer from 'multer';
import path from 'path'; // For handling file extensions and paths
import fs from 'fs'; // For checking and creating directories
import Controller from './Submission.controller';
import { verifyAuthToken } from '@/middlewares/auth';

const submissions: Router = Router();
const controller = new Controller();

// Define the upload folder path
const uploadFolder = 'submissonUploads/';

// Ensure the uploads folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure multer for file uploads with custom filename and create folder if not exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Set the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Combine fieldname, unique suffix, and extension
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .pdf files are allowed!'));
  }
});

/**
 * POST /submissions/create
 * @summary Create submission with file upload
 * @tags Submission
 * @param {CreateSubmissionBody} request.body.required
 * @param {file} request.file.required - submission file (PDF)
 * @return {Submission} 201 - submission created
 */
submissions.post(
  '/create',
  verifyAuthToken,
  upload.single('submissionFile'), // Handle file upload
  controller.createSubmission
);

/**
 * GET /submissions/getall
 * @summary Get all submission data
 * @tags Submission
 * @return {Array.<Submission>} 200 - submission list
 */
submissions.get(
  '/getall',
  verifyAuthToken,
  controller.getallsubmissions
);

/**
 * GET /submissions/deleteall
 * @summary Delete all submission data
 * @tags Submission
 * @return {number} 200 - submission clear
 */
submissions.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteallsubmissions
);

export default submissions;
