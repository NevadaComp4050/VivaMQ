import { type NextFunction, type Request } from 'express';
import { type VivaQuestion, Submission, Role } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import VivaQuestionService from './VivaQuestion.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

// import { v4 as uuidv4 } from 'uuid';
// Should this be here? No probably not
import prisma from '@/lib/prisma';


export default class VivaQuestionController extends Api {
  private readonly vivaQuestionService = new VivaQuestionService();

  public createVivaQuestion = async (
    req: Request,
    res: CustomResponse<VivaQuestion>,
    next: NextFunction
  ) => {
    try {
      const newVivaQuestion = await this.vivaQuestionService.createVivaQuestion(req.body);
      this.send(res, newVivaQuestion, HttpStatusCode.Created, 'createVivaQuestion');
    } catch (e) {
      next(e);
    }
  };

  public getAll = async (
    req: Request,
    res: CustomResponse<VivaQuestion[]>,
    next: NextFunction
  ) => {
    try {
      const vivaQuestionList = await this.vivaQuestionService.getAll();
      this.send(res, vivaQuestionList, HttpStatusCode.Ok, 'gotAllVivaQuestions' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<VivaQuestion[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.vivaQuestionService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllVivaQuestions' )
    } catch (e) {
      next(e)
    }
  }
}
