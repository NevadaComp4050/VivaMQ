import { type NextFunction, type Request } from 'express';
import { type Tutor } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import TutorService from './Tutor.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class TutorController extends Api {
  private readonly tutorService = new TutorService();

  public createTutor = async (
    req: Request,
    res: CustomResponse<Tutor>,
    next: NextFunction
  ) => {
    try {
      const newTutor = await this.tutorService.createTutor(req.body);
      this.send(res, newTutor, HttpStatusCode.Created, 'createTutor');
    } catch (e) {
      next(e);
    }
  };

  public getalltutors = async (
    req: Request,
    res: CustomResponse<Tutor[]>,
    next: NextFunction
  ) => {
    try {
      const tutorList = await this.tutorService.getTutors();
      this.send(res, tutorList, HttpStatusCode.Ok, 'gotAllTutors');
    } catch (e) {
      next(e);
    }
  };

  public deletealltutors = async (
    req: Request,
    res: CustomResponse<Tutor[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.tutorService.deleteTutors();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllTutors' )
    } catch (e) {
      next(e)
    }
  };
}