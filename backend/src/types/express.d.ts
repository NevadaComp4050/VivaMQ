import { User } from '@prisma/client';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}


declare namespace Express {
  export interface Request {
    user?: { 
      id: string;
      email: string;
      role: string;
    };
  }
}



interface LocalUser {
  id: string;
}

export interface ExtendedRequest extends Request {
  user?: LocalUser;
}
