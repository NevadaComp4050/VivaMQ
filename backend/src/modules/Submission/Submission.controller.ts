import { type NextFunction, type Request } from 'express';
import { type Submission } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import SubmissionService from './Submission.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { queueVivaGeneration } from '@/vivaGenerationQueue';

export default class SubmissionController extends Api {
  private readonly submissionService = new SubmissionService();

  public createSubmission = async (
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      
      const { file } = req;
      const filePath = file ? file.path : '';

      
      const submissionData = {
        ...req.body,
        submissionFile: filePath,
      };

      const newSubmission = await this.submissionService.createSubmission(submissionData);
      this.send(res, newSubmission, HttpStatusCode.Created, 'createSubmission');

      queueVivaGeneration(newSubmission.id);


    } catch (e) {
      next(e);
    }
  };

  public getallsubmissions = async (
    req: Request,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const submissionList = await this.submissionService.getSubmissions();
      this.send(res, submissionList, HttpStatusCode.Ok, 'gotAllSubmissions');
    } catch (e) {
      next(e);
    }
  };

  public deleteallsubmissions = async (
    req: Request,
    res: CustomResponse<number>,
    next: NextFunction
  ) => {
    try {
      const count = await this.submissionService.deleteSubmissions();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllSubmissions');
    } catch (e) {
      next(e);
    }
  };
}
