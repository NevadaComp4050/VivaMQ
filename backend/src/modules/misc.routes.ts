import { Router } from 'express';
import { verifyAuthToken , generateAuthToken} from '@/middlewares/auth';
import Controller from './User/User.controller';


const misc: Router = Router();
const controller = new Controller();

misc.post('/login',
    controller.getreq,
    generateAuthToken
)

misc.post('/register',
    controller.getreq

)