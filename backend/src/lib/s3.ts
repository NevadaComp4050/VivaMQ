import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new S3();

export const uploadToS3 = async (file: Express.Multer.File) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: path.basename(file.path),
    Body: fileStream,
    ContentType: 'application/pdf',
  };

  const result = await s3.upload(uploadParams).promise();

  
  fs.unlinkSync(file.path);

  return result.Location; 
};
