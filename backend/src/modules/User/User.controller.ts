import { type NextFunction, type Request } from 'express';
import { type User, Role } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UserService from './User.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

// import { v4 as uuidv4 } from 'uuid';
// Should this be here? No probably not
import prisma from '@/lib/prisma';


export default class UserController extends Api {
  private readonly userService = new UserService();

  public createUser = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      // id: uuidv4()
      /*
      const testUser = {
        id: 'User8',
        createdAt: new Date,
        email: 'email here',
        name: 'something',
        phone: 'please work',
        password: 'i have no idea what im doing',
        role: 
      }*/

      /*
      const result = await prisma.user.deleteMany();
      const newUser = await prisma.user.create({
        data: {
          email: 'student@example.com',
          name: 'John Doe',
          phone: '123-456-7890',
          password: 'securepassword123',  // Ensure this is hashed in a real app
          //role: Role.STUDENT,             // Setting the role to STUDENT
        },})
        */

      //const user = await this.userService.createUser(newUser);
      // Pass func(req.body) to service
      const newUser = await this.userService.createUser(req.body);
      this.send(res, newUser, HttpStatusCode.Created, 'createUser');
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
      this.send(res, user, HttpStatusCode.Ok, 'gotUser:' )
    } catch (e) {
      next(e)
    }
  }

  public getAll = async (
    req: Request,
    res: CustomResponse<User[]>,
    next: NextFunction
  ) => {
    try {
      const userList = await this.userService.getAll();
      this.send(res, userList, HttpStatusCode.Ok, 'gotAllUsers' )
    } catch (e) {
      next(e)
    }
  }

  public delete = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const user = await this.userService.delete(id);
      this.send(res, user, HttpStatusCode.Ok, 'deletedUser:' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<User[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.userService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllUsers' )
    } catch (e) {
      next(e)
    }
  }
}
