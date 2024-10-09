import { type NextFunction, type Request } from 'express';
import { type User } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UserService from './User.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();

  public create = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const newUser = await this.userService.createUser(req.body);
      this.send(res, newUser, HttpStatusCode.Created, 'createUser');
    } catch (e) {
      next(e);
    }
  };

  public createreq = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const newUser: User = await this.userService.createUser(req.body);
      const ID = newUser.id;
      req.body = { ID };
      next();
    } catch (e) {
      next(e);
    }
  };

  public getreq = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      const ID = user.id;
      req.body = { ID };
      next();
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const user = await this.userService.get(id);
      if (!user) {
        throw new Error('User not found');
      }
      this.send(res, user, HttpStatusCode.Ok, 'gotUser:' + id);
    } catch (e) {
      next(e);
    }
  };

  public getAll = async (
    req: Request,
    res: CustomResponse<User[]>,
    next: NextFunction
  ) => {
    try {
      const userList = await this.userService.getAll();
      this.send(res, userList, HttpStatusCode.Ok, 'gotAllUsers');
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const user = await this.userService.delete(id);
      this.send(res, user, HttpStatusCode.Ok, 'deletedUser:+id');
    } catch (e) {
      next(e);
    }
  };

  public deleteAll = async (
    req: Request,
    res: CustomResponse<User[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.userService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllUsers');
    } catch (e) {
      next(e);
    }
  }

  
  public dummyLogin = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.dummyLogin();
      this.send(res, user, HttpStatusCode.Ok, 'loggedInTestUser');
    } catch (e) {
      next(e);
    }
  };

  
  public getCurrentUser = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.getCurrentUser();
      this.send(res, user, HttpStatusCode.Ok, 'gotCurrentUser');
    } catch (e) {
      next(e);
    }
  };
}
