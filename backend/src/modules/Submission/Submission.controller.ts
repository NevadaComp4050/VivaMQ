import { type NextFunction, type Request } from 'express';
import { type Submission } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import SubmissionService from './Submission.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class SubmissionController extends Api {
  private readonly submissionService = new SubmissionService();

  public create = async (
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const newSubmission = await this.submissionService.create(req.body);
      this.send(res, newSubmission, HttpStatusCode.Created, 'createSubmission');
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const submission = await this.submissionService.get(id);
      this.send(res, submission, HttpStatusCode.Ok, 'gotSubmission:'+id )
    } catch (e) {
      next(e)
    }
  }

  public getAll = async (
    req: Request,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const submissionList = await this.submissionService.getAll();
      this.send(res, submissionList, HttpStatusCode.Ok, 'gotAllSubmissions');
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const submission = await this.submissionService.delete(id);
      this.send(res, submission, HttpStatusCode.Ok, 'deletedSubmission' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.submissionService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllSubmissions' )
    } catch (e) {
      next(e)
    }
  };
}