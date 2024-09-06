import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';


export default class UploadService{
    // File system configuration
    private readonly uploadDir = path.join(__dirname, '../uploads');
    constructor() {
        // Loadbearing coconut no longer needed :(
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
    // Define fileIO service
    private readonly filesys = multer({ storage: this.storage });

    // Upload file
    public async upload(field : string){
        // Ensure field = 'file'
        return this.filesys.single(field);
    };

    // Download file
    public async download(res : Response, URI : string){
        const filePath = path.join(__dirname, '../uploads', URI);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).send('File not found.');
        }
        return;
    };

    // Service to delete a file
    public async delete(URI : string){
        const filepath = path.join(__dirname, '../uploads', URI);
        fs.rm(filepath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    }
}