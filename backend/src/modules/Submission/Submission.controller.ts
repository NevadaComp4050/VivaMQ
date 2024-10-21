import { type NextFunction, type Request } from 'express';
import { HttpStatusCode } from 'axios';
import { type Submission } from '@prisma/client';
import SubmissionService from './Submission.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class SubmissionController extends Api {
  private readonly submissionService = new SubmissionService();

  public getVivaQuestions = async (
    req: Request,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;
      const vivaQuestions =
        await this.submissionService.getVivaQuestions(submissionId);
      this.send(res, vivaQuestions, HttpStatusCode.Ok, 'getVivaQuestions');
    } catch (e) {
      next(e);
    }
  };

  public generateVivaQuestions = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;

      void this.submissionService.generateVivaQuestions(submissionId);

      res.status(HttpStatusCode.Accepted).send({
        message: 'Viva questions are being generated. Please check back later.',
      });
    } catch (e) {
      next(e);
    }
  };

  public exportVivaQuestions = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { format } = req.query;

      if (format !== 'pdf' && format !== 'csv') {
        return res.status(HttpStatusCode.BadRequest).send({
          message: 'Invalid format. Please specify either "pdf" or "csv".',
        });
      }

      res.status(HttpStatusCode.NotImplemented).send({
        message: `Export Viva Questions functionality is not yet implemented.`,
      });
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
      this.send(res, submission, HttpStatusCode.Ok, 'deletedSubmission');
    } catch (e) {
      next(e);
    }
  };

  public deleteAll = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const count = await this.submissionService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllSubmissions');
    } catch (e) {
      next(e);
    }
  };

  public getSubmissionPDF = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const pdfData = await this.submissionService.getPDFById(id);

      if (!pdfData) {
        return res.status(HttpStatusCode.NotFound).send('PDF not found');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=submission_${id}.pdf`
      );
      res.send(pdfData);
    } catch (e) {
      next(e);
    }
  };
}
