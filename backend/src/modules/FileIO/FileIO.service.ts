
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';


export default class UploadService{

    // Upload file

    // Download file

    /*
    const filedir = '../uploads'

    // Configure multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });

    const upload = multer({ storage });

    // Function to handle file uploads
    const handleFileUpload = upload.single('file');

    const handleFileDownload = async (
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
}