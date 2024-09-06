import { type NextFunction, type Response, type Request } from 'express';
import { HttpStatusCode } from 'axios';
import AIProcessService from '../AIProcess/AIProcess.service'
import Api from '@/lib/api';


export default class AIProcessController extends Api{
    private readonly AIProcService = new AIProcessService();

    public processFile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const filename = req.params.filename;
            // Create Viva in DB
            this.AIProcService.sendpdf(filename);
            next();
        } catch  (e) {
            next(e)
        }
    }
}