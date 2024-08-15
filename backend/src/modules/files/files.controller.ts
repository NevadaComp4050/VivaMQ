import { NextFunction, Request } from 'express';
import { File } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import FileService from './files.service';
import { CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class FileController extends Api {
  private readonly fileService = new FileService();

  public getAllFiles = async (req: Request, res: CustomResponse<File[]>, next: NextFunction) => {
    try {
      const files = await this.fileService.getFiles();
      this.send(res, files, HttpStatusCode.Ok, 'gotAllFiles');
    } catch (e) {
      next(e);
    }
  };

  public mapFilesToStudents = async (req: Request, res: CustomResponse<File>, next: NextFunction) => {
    try {
      const updatedFile = await this.fileService.mapFile(req.params.fileId, req.body);
      this.send(res, updatedFile, HttpStatusCode.Ok, 'mapFilesToStudents');
    } catch (e) {
      next(e);
    }
  };
}