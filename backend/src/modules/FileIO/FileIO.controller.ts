import { type NextFunction, type Response,type Request } from 'express';
//import { type User, Role } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UploadService from './FileIO.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';


export default class FileIOController extends Api {
  private readonly UploadService = new UploadService();

  
  // Methods
  
  // Upload TOO Server
  /**
  * This function takes a request matches on its 
  * and passes it to a requestHandler that matches
  * on the 'file' field of that request.
  * The file is saved for later retrieval.
  */ 
  public handleFileUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const func = await this.UploadService.upload('file');
      func(req,res,(err) => {
        if (err) {
          return next(err);
        }
        next();
      });
    } catch(e) {
      next(e);
    }
  }
  // curl -F "file=@PATHTOFILE" http://localhost:8080/api/v1/development/files/upload

  // Download FROM server
  public handleFileDownload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filename = req.params.filename;
      this.UploadService.download(res,filename);
    } catch (e) {
        next(e);
    }
  }
  // curl -O http://localhost:8080/api/v1/development/files/download/FILE
}