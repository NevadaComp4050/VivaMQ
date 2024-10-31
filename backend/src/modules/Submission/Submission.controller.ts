import { type NextFunction, type Request } from 'express';
import { HttpStatusCode } from 'axios';
import { type Submission } from '@prisma/client';
import SubmissionService from './Submission.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { type ExtendedRequest } from '@/types/express';

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
        message: 'Your request to generate viva questions has been accepted.',
      });
    } catch (e) {
      next(e);
    }
  };

  public getSummary = async (
    req: Request,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;
      const vivaQuestions =
        await this.submissionService.getSummary(submissionId);
      this.send(res, vivaQuestions, HttpStatusCode.Ok, 'getSummary');
    } catch (e) {
      next(e);
    }
  };

  public generateSummary = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;

      void this.submissionService.generateSummary(submissionId);

      res.status(HttpStatusCode.Accepted).send({
        message: 'Your request to generate a summery has been accepted.',
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
      this.send(res, submission, HttpStatusCode.Ok, 'Soft Deleted Submission');
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

  public mapMultipleSubmissions = async (
    req: Request,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const { mappings } = req.body;

      if (!Array.isArray(mappings) || mappings.length === 0) {
        throw new Error('Mappings must be a non-empty array');
      }

      const updatedSubmissions =
        await this.submissionService.mapMultipleSubmissions(mappings);

      this.send(
        res,
        updatedSubmissions,
        HttpStatusCode.Ok,
        'multipleStudentMappings'
      );
    } catch (e) {
      next(e);
    }
  };

  public getSubmissionById = async (
    req: Request,
    res: CustomResponse<Submission | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const submission = await this.submissionService.getSubmissionById(id);

      if (!submission) {
        return res.status(HttpStatusCode.NotFound).send({
          message: 'Submission not found',
        });
      }

      this.send(res, submission, HttpStatusCode.Ok, 'getSubmissionById');
    } catch (e) {
      next(e);
    }
  };

  public regenerateUnlockedQuestions = async (
    req: ExtendedRequest,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { id: submissionId } = req.params;
      await this.submissionService.regenerateUnlockedQuestions(submissionId);
      res.status(HttpStatusCode.Accepted).json({
        message: 'Viva questions regeneration started',
        data: undefined,
      });
    } catch (e) {
      next(e);
    }
  };

  public getLockedStatus = async (
    req: ExtendedRequest,
    res: CustomResponse<Array<{ category: string; locked: boolean }>>,
    next: NextFunction
  ) => {
    try {
      const { id: submissionId } = req.params;

      // Retrieve locked status and assign 'Unknown' for any missing category
      const lockedStatus = (
        await this.submissionService.getLockedStatus(submissionId)
      ).map((status) => ({
        ...status,
        category: status.category ?? 'Unknown',
      }));

      res.status(HttpStatusCode.Ok).json({
        message: 'Locked status retrieved successfully',
        data: lockedStatus,
      });
    } catch (e) {
      next(e);
    }
  };

  public addCustomQuestion = async (
    req: Request,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;
      const { question } = req.body;

      // Validate question text
      if (!question || typeof question !== 'string') {
        return res.status(HttpStatusCode.BadRequest).send({
          message: 'Invalid question text. Please provide a valid question.',
        });
      }

      // Call the service function to add the custom question
      const newQuestion = await this.submissionService.addCustomQuestion(
        submissionId,
        question
      );

      res.status(HttpStatusCode.Created).json({
        message: 'Custom viva question created successfully',
        data: newQuestion,
      });
    } catch (e) {
      next(e);
    }
  };
}
