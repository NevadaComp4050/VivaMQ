import { NextFunction, Request } from 'express';
import { User } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UserService from './users.service';
import { CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();

  public createUser = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.createUser(req.body);
      this.send(res, user, HttpStatusCode.Created, 'createUser');
    } catch (e) {
      next(e);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: CustomResponse<User[]>,
    next: NextFunction
  ) => {
    try {
      const userList = await this.userService.getUsers();
      this.send(res, userList, HttpStatusCode.Ok, 'gotAllUsers');
    } catch (e) {
      next(e);
    }
  };
}
