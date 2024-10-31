import { type NextFunction } from 'express';
import { type Assignment, type Submission } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import AssignmentService from './Assignment.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { type ExtendedRequest } from '@/types/express';

export default class AssignmentController extends Api {
  private readonly assignmentService = new AssignmentService();

  // Create an assignment
  public create = async (
    req: ExtendedRequest,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return this.unauthorizedResponse(res, 'User not authenticated');
      }

      const newAssignment = await this.assignmentService.create(req.body);
      this.send(res, newAssignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      next(e);
    }
  };

  // Get a specific assignment with writeable flag
  public get = async (
    req: ExtendedRequest,
    res: CustomResponse<Assignment & { writeable: boolean }>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      console.log('Assignments requested by: ', userId);
      if (!userId) {
        return this.unauthorizedResponse(res, 'User not authenticated');
      }

      const assignment = await this.assignmentService.get(id, userId);
      this.send(res, assignment, HttpStatusCode.Ok, `gotAssignment:${id}`);
    } catch (e) {
      next(e);
    }
  };

  // Get all assignments
  public getAll = async (
    req: ExtendedRequest,
    res: CustomResponse<Assignment[]>,
    next: NextFunction
  ) => {
    try {
      const assignmentList = await this.assignmentService.getAll();
      this.send(res, assignmentList, HttpStatusCode.Ok, 'gotAllAssignments');
    } catch (e) {
      next(e);
    }
  };

  // Delete a specific assignment
  public delete = async (
    req: ExtendedRequest,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.delete(id);
      this.send(res, assignment, HttpStatusCode.Ok, 'deletedAssignment');
    } catch (e) {
      next(e);
    }
  };

  // Get an assignment with submissions
  public getAssignmentWithSubmissions = async (
    req: ExtendedRequest,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return this.unauthorizedResponse(res, 'User not authenticated');
      }

      const assignment =
        await this.assignmentService.getAssignmentWithSubmissions(id, userId);

      if (!assignment) {
        return this.notFoundResponse(res, 'Assignment not found');
      }

      this.send(
        res,
        assignment,
        HttpStatusCode.Ok,
        'gotAssignmentWithSubmissions'
      );
    } catch (e) {
      next(e);
    }
  };

  // Delete all assignments
  public deleteAll = async (
    req: ExtendedRequest,
    res: CustomResponse<number>,
    next: NextFunction
  ) => {
    try {
      const count = await this.assignmentService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllAssignments');
    } catch (e) {
      next(e);
    }
  };

  public createSubmission = async (
    req: ExtendedRequest,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return this.unauthorizedResponse(res, 'User not authenticated');
      }

      if (!req.file?.buffer) {
        return this.badRequestResponse(res, 'No file uploaded');
      }

      const { id: assignmentId } = req.params;
      if (!assignmentId) {
        return this.badRequestResponse(res, 'Assignment ID is required');
      }

      const fileBuffer = req.file.buffer;
      const originalFileName = req.file.originalname;

      const newSubmission = await this.assignmentService.createSubmission({
        assignmentId,
        fileBuffer,
        originalFileName,
      });

      this.send(res, newSubmission, HttpStatusCode.Created, 'createSubmission');
    } catch (e) {
      next(e);
    }
  };

  // Get submissions for an assignment
  public getSubmissions = async (
    req: ExtendedRequest,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const submissions = await this.assignmentService.getSubmissions(
        assignmentId,
        limit,
        offset
      );

      this.send(res, submissions, HttpStatusCode.Ok, 'getSubmissions');
    } catch (e) {
      next(e);
    }
  };

  // Map a student to a submission
  public mapStudentToSubmission = async (
    req: ExtendedRequest,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;
      const { studentId } = req.body;

      if (!studentId) {
        return this.badRequestResponse(res, 'Student ID is required');
      }

      const updatedSubmission =
        await this.assignmentService.mapStudentToSubmission(
          submissionId,
          studentId
        );

      this.send(
        res,
        updatedSubmission,
        HttpStatusCode.Ok,
        'studentMappedToSubmission'
      );
    } catch (e) {
      next(e);
    }
  };

  // Get student-submission mappings for an assignment
  public getStudentSubmissionMapping = async (
    req: ExtendedRequest,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;

      const mappings =
        await this.assignmentService.getStudentSubmissionMapping(assignmentId);

      this.send(res, mappings, HttpStatusCode.Ok, 'studentSubmissionMapping');
    } catch (e) {
      next(e);
    }
  };

  // Generate viva questions for an assignment
  public generateVivaQuestions = async (
    req: ExtendedRequest,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;

      await this.assignmentService.generateVivaQuestions(assignmentId);

      this.send(
        res,
        null,
        HttpStatusCode.Accepted,
        'vivaQuestionsGenerationStarted'
      );
    } catch (e) {
      next(e);
    }
  };

  // Generate summaries for an assignment
  public generateSummaries = async (
    req: ExtendedRequest,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;

      await this.assignmentService.generateSummaries(assignmentId);

      this.send(
        res,
        null,
        HttpStatusCode.Accepted,
        'Summary Generation Started'
      );
    } catch (e) {
      next(e);
    }
  };

  // Helper methods for common responses
  private unauthorizedResponse(res: CustomResponse<any>, message: string) {
    return res.status(HttpStatusCode.Unauthorized).json({
      message,
      data: null,
    });
  }

  private badRequestResponse(res: CustomResponse<any>, message: string) {
    return res.status(HttpStatusCode.BadRequest).json({
      message,
      data: null,
    });
  }

  private notFoundResponse(res: CustomResponse<any>, message: string) {
    return res.status(HttpStatusCode.NotFound).json({
      message,
      data: null,
    });
  }

  public downloadVivas = async (
    req: ExtendedRequest,
    res: CustomResponse<Buffer>,
    next: NextFunction
  ) => {
    try {
      const { id: assignmentId } = req.params;
      const { studentIds } = req.body;

      const zipBuffer = await this.assignmentService.generateVivaQuestionsZip(
        assignmentId,
        studentIds
      );

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=viva_questions_${assignmentId}.zip`,
      });
      res.send(zipBuffer);
    } catch (error) {
      next(error);
    }
  };
}
