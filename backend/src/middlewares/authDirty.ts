import { type NextFunction, type Request, type Response } from 'express';
import * as crypto from 'crypto';
import Api from '@/lib/api';
import { Http } from 'winston/lib/winston/transports';
import { HttpStatusCode } from 'axios';

const auth_en:boolean = true;

const algorithm = 'aes-256-cbc';
// Key changes everytime
//const key = crypto.randomBytes(32);
// Static key
const secret = "Nevada";
const key = crypto.createHash('sha256').update(secret).digest().slice(0, 32);
//const iv = crypto.randomBytes(16);
const iv = crypto.createHash('sha256').update(secret).digest().slice(0, 16);


interface DirtyJWT {
  userID: string;
  Epoch: number;
}

// 5mins valid
const validPeriod = 36000;

export default class AuthDirty extends Api {



  // TODO is this needed?
  /**
   * 
   * @param req req.body.user should contain a new user
   * @param res 
   * @param next 
   */
  public static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Take a newly created user from req
    const ID  = req.body.user.id;
    console.log(ID);
    res.status(HttpStatusCode.Ok);
    next();
  }

  /**
   * Checks if authentication has a valid {@link DirtyJWT | DirtyJWT}.
   * @param req req.headers checked for authentication
   * @param res 
   * @param next 
   */
  public static verifyAuthToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
    
    //console.log(req.body);
    if(!authorization){
      console.log('Caught unauthorised access attempt');
      if(auth_en){
        // TODO Respond access denied
        return next("Failed: No authorisation");
      }
      return next();
    }
    const token = authorization.split(' ')[1];
    //console.log(token);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = decipher.update(token, 'hex', 'utf8');
    const dec = decrypted+decipher.final('utf8');
    //console.log(dec);
    const tokenReq: DirtyJWT = JSON.parse(dec);
    console.log(tokenReq);
    if (Math.floor(Date.now() / 1000)>tokenReq.Epoch){
      console.log('Token has expired');
      if(auth_en){
        // TODO Respond access expired
        next('Failed: Token has expired');
      }
    }
    //console.log('token still valid for %d sec',tokenReq.Epoch-(Math.floor(Date.now() / 1000)))

    // Check if user is valid
    // Does this even make sense? This token is encrypted.
    // Maybe pass forward user info in some way
    next();
  }


  // Requires the user ID to be in the req body
  /**
   * Generates a {@link DirtyJWT | DirtyJWT} for the user in req.
   * @param req req.body should must contain the user
   * @param res 
   * @param next 
   */
  public static generateAuthToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.body)
    let ID  = req.body.user.id
    // Need the ID
    // Generate a token
    if(!ID){
      console.log('No ID supplied');
      ID = 'b156270a-a7cd-484b-8e22-732e25d3a2a7';
    }
    const currentEpoch = Math.floor(Date.now() / 1000);
    const tokenPlain: DirtyJWT = {
      Epoch: currentEpoch+validPeriod,
      userID: ID
    };
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = cipher.update(JSON.stringify(tokenPlain), 'utf8', 'hex');
    const token  = encrypted+cipher.final('hex');

    res.setHeader('Authorization', `Bearer ${token}`);
    //res.json({ message: 'Logged in successfully' });
    //res.json(null)
    res.status(HttpStatusCode.Ok).send();
    //next();
  }

  public static refreshAuthToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

  }

  
}