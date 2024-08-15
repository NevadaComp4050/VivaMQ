import { NextFunction, Request } from 'express';
import { Tutor } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import TutorService from './tutors.service';
import { CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class TutorController extends Api {
  private readonly tutorService = new TutorService();

  public createTutor = async (req: Request, res: CustomResponse<Tutor>, next: NextFunction) => {
    try {
      const tutor = await this.tutorService.createTutor(req.body);
      this.send(res, tutor, HttpStatusCode.Created, 'createTutor');
    } catch (e) {
      next(e);
    }
  };

  public getAllTutors = async (req: Request, res: CustomResponse<Tutor[]>, next: NextFunction) => {
    try {
      const tutorList = await this.tutorService.getTutors();
      this.send(res, tutorList, HttpStatusCode.Ok, 'gotAllTutors');
    } catch (e) {
      next(e);
    }
  };
}