import { type NextFunction, type Request } from 'express';
import { type User } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UserService from './User.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';



export default class UserController extends Api {
  private readonly userService = new UserService();

  // Function that reads the final response from req.body
  public sendFinal = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      this.send(
        res,
        req.body.final.data,
        req.body.final.httpCode,
        req.body.final.message
      )
    } catch (e){
      next(e)
    }
  }

  /**
   * Places a {@link User | User} into req {@linkplain create}
   * @param req 
   * @param res 
   * @param next 
   */
  public create = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      //req.body = { ... req.body, phile: "philly" }
      //console.log(req.body);
      //console.log(req);

      const newUser = await this.userService.create(req.body);

      //*
      //req.body = {... req.body, newUser: newUser}
      // Need to track the changes from previous req
      req.body = {newUser, final: {data: newUser, message: 'createdUser', httpCode: 200}}

      //console.log(req.body)
      // */

      next()
      //this.send(res, newuser , HttpStatusCode.Created, 'createUser');
      // this.nextSend()
      //this.send(res, req.body.final.data , HttpStatusCode.Created, req.body.final.message);
    } catch (e) {
      next(e);
    }
  };

  /* TODO: Delete this
  public createreq = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const newUser: User = await this.userService.create(req.body);
      const ID = newUser.id;
      req.body = { ID };
      next();
    } catch (e) {
      next(e);
    }
  };
  */

  /* TODO: Delete this
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
  */

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

  public getTest = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      console.log(req);
      // req = req.
      next();
    } catch (e) {
      next(e)
    }
  }

  public sendTest = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      //next()
      this.send(res,null, HttpStatusCode.MethodNotAllowed,
         'failed successfully')
    } catch (e) {
      next(e)
    }
  }

}
