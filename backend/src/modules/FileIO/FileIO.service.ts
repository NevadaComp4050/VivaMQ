import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';
import { createHash } from 'crypto';


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
        //*
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
        // */
    });
    // Define fileIO service
    private readonly filesys = multer({ storage: this.storage });

    // #####
    // Function to generate a SHA-256 hash from the file's content
    public generateSHA256Hash(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = createHash('sha256');
            const stream = fs.createReadStream(filePath);
        
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (err) => reject(err));
        });
    }

    
    // Upload file
    public async upload(field : string){
        // Ensure field = 'file'
        //console.log(createHash);
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