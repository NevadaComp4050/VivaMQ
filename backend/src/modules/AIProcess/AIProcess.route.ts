import { Router } from 'express'
import Controller from './AIProcess.controller';
import { verifyAuthToken } from '@/middlewares/auth';

const AIProcs: Router = Router();
const controller = new Controller();

AIProcs.get(
    '/:filename',
    verifyAuthToken,
    controller.processFile
);


export default AIProcs;