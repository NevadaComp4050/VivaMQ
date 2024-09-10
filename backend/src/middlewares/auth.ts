import { error } from 'console';
import { type NextFunction, type Request, type Response } from 'express';
import AuthDirty from './authDirty'


export const verifyAuthToken = async (
  // Remove underscore of params once you start using them
  req: Request,
  res: Response,
  next: NextFunction
) => {

  return AuthDirty.verifyAuthToken(req,res,next);
  // just incase
  next();
};


// Stub
export const generateAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Code to create a new token here
  return AuthDirty.generateAuthToken(req,res,next);
  // Dont forget next, even if its unreachable
  next();
};
