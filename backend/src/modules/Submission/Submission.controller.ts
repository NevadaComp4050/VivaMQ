import { type NextFunction, type Request } from 'express';
import { HttpStatusCode } from 'axios';
import SubmissionService from './Submission.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class SubmissionController extends Api {
  private readonly submissionService = new SubmissionService();

  // Retrieve Viva Questions for a specific submission
  public getVivaQuestions = async (
    req: Request,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;
      const vivaQuestions = await this.submissionService.getVivaQuestions(submissionId);
      this.send(res, vivaQuestions, HttpStatusCode.Ok, 'getVivaQuestions');
    } catch (e) {
      next(e);
    }
  };

  // Trigger Viva Questions generation for a specific submission
  public generateVivaQuestions = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;

   
      this.submissionService.generateVivaQuestions(submissionId);

      res.status(HttpStatusCode.Accepted).send({
        message: 'Viva questions are being generated. Please check back later.',
      });
    } catch (e) {
      next(e);
    }
  };
}
