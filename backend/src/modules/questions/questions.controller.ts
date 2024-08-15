import { NextFunction, Request } from 'express';
import { Questions } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import QuestionService from './questions.service';
import { CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class QuestionController extends Api {
  private readonly questionService = new QuestionService();

  public generateQuestions = async (
    req: Request,
    res: CustomResponse<Questions[]>,
    next: NextFunction
  ) => {
    try {
      const questions = await this.questionService.generateQuestions(
        req.params.fileId
      );
      this.send(res, questions, HttpStatusCode.Created, 'generateQuestions');
    } catch (e) {
      next(e);
    }
  };

  public updateQuestion = async (
    req: Request,
    res: CustomResponse<Questions>,
    next: NextFunction
  ) => {
    try {
      const updatedQuestion = await this.questionService.updateQuestion(
        req.params.id,
        req.body
      );
      this.send(res, updatedQuestion, HttpStatusCode.Ok, 'updateQuestion');
    } catch (e) {
      next(e);
    }
  };
}
