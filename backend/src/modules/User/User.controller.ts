import { type NextFunction, type Request, Response } from 'express';
import UserService from './User.service';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from 'axios';
import { User } from '@prisma/client';

export default class UserController {
  private readonly userService = new UserService();

  // Register a new user with hashed password
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser: User = await this.userService.createUser(req.body);
      res.status(HttpStatusCode.Created).json(newUser);
    } catch (err) {
      next(err);
    }
  };

  // Login a user and issue JWT token
  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await this.userService.validateUser(email, password);

      if (!user) {
        return res.status(HttpStatusCode.Unauthorized).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.JWT_SECRET || 'your_secret',
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } catch (err) {
      next(err);
    }
  };

  // Get current authenticated user
  public getCurrentUser = async (req: Request, res: Response) => {
    return res.json(req.user);
  };
}
