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
      const { title, assignmentId, rubricData } = req.body;

      if (!createdById || !title || !assignmentId || !rubricData) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Title, assignment ID, and rubric data are required.',
          data: null,
        });
      }

      const newRubric = await this.rubricService.createRubric({
        title,
        assignmentId,
        createdById,
        rubricData,
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

  public getRubricById = async (
    req: Request,
    res: CustomResponse<Rubric | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const rubric = await this.rubricService.getRubricById(id);

      if (!rubric) {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Rubric not found',
          data: null,
        });
      }

      this.send(res, rubric, HttpStatusCode.Ok, 'gotRubric');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public updateRubric = async (
    req: Request,
    res: CustomResponse<Rubric | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { title, rubricData } = req.body;

      const updatedRubric = await this.rubricService.updateRubric(id, {
        title,
        rubricData,
      });

      if (!updatedRubric) {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Rubric not found',
          data: null,
        });
      }

      this.send(res, updatedRubric, HttpStatusCode.Ok, 'updatedRubric');
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
      
      if (!deletedRubric) {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Rubric not found',
          data: null,
        });
      }

      this.send(res, deletedRubric, HttpStatusCode.Ok, 'deletedRubric');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };
}