import { type NextFunction, type Request } from 'express';
import { type Assignment, type Submission } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import AssignmentService from './assignment.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class AssignmentController extends Api {
  private readonly assignmentService = new AssignmentService();

  public create = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const newAssignment = await this.assignmentService.create(req.body);
      this.send(res, newAssignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.get(id);
      this.send(res, assignment, HttpStatusCode.Ok, 'gotAssignment:' + id);
    } catch (e) {
      next(e);
    }
  };

  public getAll = async (
    req: Request,
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

  public delete = async (
    req: Request,
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

  public getAssignmentWithSubmissions = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const assignment =
        await this.assignmentService.getAssignmentWithSubmissions(id);
      if (!assignment) {
        return this.send(
          res,
          null,
          HttpStatusCode.NotFound,
          'assignmentNotFound'
        );
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

  public deleteAll = async (
    req: Request,
    res: CustomResponse<Assignment[]>,
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
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      // Check if a file was uploaded
      if (!req.file?.buffer) {
        throw new Error('No file uploaded');
      }

      const { id: assignmentId } = req.params;
      if (!assignmentId) {
        throw new Error('Assignment ID is required');
      }

      const fileBuffer = req.file.buffer;

      const newSubmission = await this.assignmentService.createSubmission({
        assignmentId,
        fileBuffer,
      });

      this.send(res, newSubmission, HttpStatusCode.Created, 'createSubmission');
    } catch (e) {
      next(e);
    }
  };

  public getSubmissions = async (
    req: Request,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      console.log(
        'Getting all submssions for assignmentId: ',
        assignmentId,
        ' with limit: ',
        limit,
        ' and offset: ',
        offset
      );

      const submissions = await this.assignmentService.getSubmissions(
        assignmentId,
        Number(limit),
        Number(offset)
      );
      this.send(res, submissions, HttpStatusCode.Ok, 'getSubmissions');
    } catch (e) {
      next(e);
    }
  };

  public mapStudentToSubmission = async (
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const { submissionId } = req.params;
      const { studentId } = req.body;

      if (!studentId) throw new Error('Student ID is required');

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

  public getStudentSubmissionMapping = async (
    req: Request,
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

  public generateVivaQuestions = async (
    req: Request,
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
}
