import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from 'axios';
import { type User } from '@prisma/client';
import UserService from './user.service';

export default class UserController {
  private readonly userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser: User = await this.userService.createUser(req.body);
      res.status(HttpStatusCode.Created).json(newUser);
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await this.userService.validateUser(email, password);

      if (!user) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .json({ error: 'Invalid email or password. Please try again.' });
      }

      const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.JWT_SECRET ?? 'your_secret',
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } catch (err) {
      next(err);
    }
  };

  public getCurrentUser = async (req: Request, res: Response) => {
    console.log('get current user: ', req.user);
    return res.json(req.user);
  };
}
