import { type NextFunction, type Request } from 'express';
import { type VivaQuestion } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import VivaQuestionService from './VivaQuestion.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { type ExtendedRequest } from '@/types/express';

export default class VivaQuestionController extends Api {
  private readonly vivaQuestionService = new VivaQuestionService();

  public create = async (
    req: Request,
    res: CustomResponse<VivaQuestion>,
    next: NextFunction
  ) => {
    try {
      const newVivaQuestion = await this.vivaQuestionService.create(req.body);
      this.send(
        res,
        newVivaQuestion,
        HttpStatusCode.Created,
        'createVivaQuestion'
      );
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<VivaQuestion>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const vivaQuestion = await this.vivaQuestionService.get(id);
      this.send(res, vivaQuestion, HttpStatusCode.Ok, 'gotVivaQuestion:' + id);
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
      this.send(
        res,
        vivaQuestionList,
        HttpStatusCode.Ok,
        'gotAllVivaQuestions'
      );
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<VivaQuestion>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const vivaQuestion = await this.vivaQuestionService.delete(id);
      this.send(res, vivaQuestion, HttpStatusCode.Ok, 'deletedVivaQuestion');
    } catch (e) {
      next(e);
    }
  };

  public deleteAll = async (
    req: Request,
    res: CustomResponse<number>,
    next: NextFunction
  ) => {
    try {
      const count = await this.vivaQuestionService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllVivaQuestions');
    } catch (e) {
      next(e);
    }
  };

  public toggleLock = async (
    req: Request,
    res: CustomResponse<VivaQuestion>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const toggledVivaQuestion = await this.vivaQuestionService.toggleLock(id);
      this.send(
        res,
        toggledVivaQuestion,
        HttpStatusCode.Ok,
        'toggledLockStatus'
      );
    } catch (e) {
      next(e);
    }
  };

  public regenerateVivaQuestion = async (
    req: Request,
    res: CustomResponse<VivaQuestion>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      const vivaQuestion = await this.vivaQuestionService.regenerate(id);
      this.send(
        res,
        vivaQuestion,
        HttpStatusCode.Created,
        'regeneratedVivaQuestion'
      );
    } catch (e) {
      next(e);
    }
  };

  public lockVivaQuestion = async (
    req: Request,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await this.vivaQuestionService.lockVivaQuestion(id);
      this.send(res, null, HttpStatusCode.Created, 'Locked question');
    } catch (e) {
      next(e);
    }
  };

  public unlockVivaQuestion = async (
    req: ExtendedRequest,
    res: CustomResponse<void>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await this.vivaQuestionService.unlockVivaQuestion(id);
      res.status(HttpStatusCode.Ok).json({
        message: 'VivaQuestion unlocked successfully',
        data: undefined,
      });
    } catch (e) {
      next(e);
    }
  };
}
