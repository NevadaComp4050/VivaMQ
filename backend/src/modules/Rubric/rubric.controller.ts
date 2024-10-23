import { NextFunction, Request, Response } from 'express';
import { Rubric } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import RubricService from './rubric.service';
import { CustomResponse } from '@/types/common.type';
import { ExtendedRequest } from '@/types/express';
import Api from '@/lib/api';
import { CreateRubricDto, UpdateRubricDto } from '@/dto/rubric.dto';
import { v4 as uuidv4 } from 'uuid';

export default class RubricController extends Api {
  private readonly rubricService = new RubricService();

  public createRubric = async (
    req: ExtendedRequest,
    res: CustomResponse<Rubric | null>,
    next: NextFunction
  ) => {
    try {
      const createdById = req.user?.id;
      if (!createdById) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'Authentication required.',
          data: null,
        });
      }

      const {
        id,
        title,
        assignmentId,
        assessmentTask,
        criteria,
        keywords,
        learningObjectives,
        existingGuide,
      } = req.body as CreateRubricDto;

      const rubric = await this.rubricService.createRubric({
        id: id ?? uuidv4(), // Generate UUID if not provided
        title,
        assignmentId,
        createdById,
        assessmentTask,
        criteria,
        keywords,
        learningObjectives,
        existingGuide,
      });

      this.send(
        res,
        rubric,
        HttpStatusCode.Accepted,
        'Rubric creation in progress.'
      );
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public getRubrics = async (
    req: Request,
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

      if (!rubric || rubric.deletedAt) {
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
      const { title, rubricData } = req.body as UpdateRubricDto;

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

  public exportRubricPDF = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const pdfBuffer = await this.rubricService.exportRubricAsPDF(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="rubric-${id}.pdf"`
      );

      res.send(pdfBuffer);
    } catch (e: any) {
      // Explicitly typing 'e' as any for accessing e.message
      console.error(e);
      res
        .status(HttpStatusCode.NotFound)
        .json({ message: e.message, data: null });
    }
  };

  // Export Rubric as XLS
  public exportRubricXLS = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const xlsBuffer = await this.rubricService.exportRubricAsXLS(id);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="rubric-${id}.xlsx"`
      );

      res.send(xlsBuffer);
    } catch (e: any) {
      // Explicitly typing 'e' as any for accessing e.message
      console.error(e);
      res
        .status(HttpStatusCode.NotFound)
        .json({ message: e.message, data: null });
    }
  };
}
