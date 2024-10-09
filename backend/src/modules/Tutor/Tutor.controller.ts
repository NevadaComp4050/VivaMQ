import { type NextFunction, type Request } from 'express';
import { type Tutor } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import TutorService from './Tutor.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class TutorController extends Api {
  private readonly tutorService = new TutorService();

  public create = async (
    req: Request,
    res: CustomResponse<Tutor>,
    next: NextFunction
  ) => {
    try {
      const newTutor = await this.tutorService.create(req.body);
      this.send(res, newTutor, HttpStatusCode.Created, 'createTutor');
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<Tutor>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const tutor = await this.tutorService.get(id);
      this.send(res, tutor, HttpStatusCode.Ok, 'gotTutor:'+id )
    } catch (e) {
      next(e)
    }
  }

  public getAll = async (
    req: Request,
    res: CustomResponse<Tutor[]>,
    next: NextFunction
  ) => {
    try {
      const tutorList = await this.tutorService.getAll();
      this.send(res, tutorList, HttpStatusCode.Ok, 'gotAllTutors');
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<Tutor>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const tutor = await this.tutorService.delete(id);
      this.send(res, tutor, HttpStatusCode.Ok, 'deletedTutor' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<Tutor[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.tutorService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllTutors' )
    } catch (e) {
      next(e)
    }
  };
}