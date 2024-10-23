import { type NextFunction, type Request } from 'express';
import { type Rubric } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import RubricService from './rubric.service';
import { type CustomResponse } from '@/types/common.type';
import { type ExtendedRequest } from '@/types/express';
import Api from '@/lib/api';

export default class RubricController extends Api {
  private readonly rubricService = new RubricService();

  public createRubric = async (
    req: ExtendedRequest,
    res: CustomResponse<Rubric | null>,
    next: NextFunction
  ) => {
    try {
      const createdById = req.user?.id;
      const { name, assignmentId, rubricFile } = req.body;

      if (!createdById || !name || !assignmentId || !rubricFile) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Name, assignment ID, and rubric file are required.',
          data: null,
        });
      }

      const newRubric = await this.rubricService.createRubric({
        name,
        assignmentId,
        createdById,
        rubricFile,
      });

      this.send(res, newRubric, HttpStatusCode.Created, 'createRubric');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public getRubrics = async (
    req: ExtendedRequest,
    res: CustomResponse<Rubric[] | null>,
    next: NextFunction
  ) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const rubrics = await this.rubricService.getRubrics(limit, offset);

      this.send(res, rubrics, HttpStatusCode.Ok, 'gotRubrics');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public linkRubricToAssignment = async (
    req: Request,
    res: CustomResponse<Rubric | null>,
    next: NextFunction
  ) => {
    try {
      const { rubricId, assignmentId } = req.body;

      if (!rubricId || !assignmentId) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Rubric ID and Assignment ID are required.',
          data: null,
        });
      }

      const linkedRubric = await this.rubricService.linkRubricToAssignment(
        rubricId,
        assignmentId
      );

      this.send(res, linkedRubric, HttpStatusCode.Ok, 'linkRubricToAssignment');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public deleteRubric = async (
    req: Request,
    res: CustomResponse<Rubric | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const deletedRubric = await this.rubricService.deleteRubric(id);
      this.send(res, deletedRubric, HttpStatusCode.Ok, 'deletedRubric');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };
}
