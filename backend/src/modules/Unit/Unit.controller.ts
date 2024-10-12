import { type NextFunction, type Request } from 'express';
import { type Assignment, type Unit } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UnitService from './Unit.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { formatResponse , filterFields} from '../../utils/mutantRequestFormat'


// Ridiculous Typescript nonsense, compile time its there, runtime it isnt
// const allowedFields = Object.keys({} as Unit) as (keyof Unit)[];

const allowedFields = ["name" , "id" , "year" , "convenorId"] as (keyof Unit)[];


export default class UnitController extends Api {
  private readonly unitService = new UnitService();

  /*
  public create = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const newUnit = await this.unitService.create(req.body);
      this.send(res, newUnit, HttpStatusCode.Created, 'createUnit');
    } catch (e) {
      next(e);
    }
  };
  */

  // TODO clean this up
  /**
   * Requires a {@link User | User}
   * @param req req.body.user must exist
   * @param res 
   * @param next 
   */
  public create = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      //console.log(allowedFields)
      //console.log(req.body);
      /** We need something called convenorId for relationship.
       * Its either supplied in the body, or inside a user object */
      let convenorId = req.body.convenorId;
      //console.log('got here')
      //console.log(convenorId)
      if(convenorId == null){
        convenorId = req.body.user.id
      }
      const arg = {...req.body,convenorId}
      //console.log(arg);
      const arg2 = filterFields<Unit>(arg,allowedFields)
      //console.log('got here')
      //console.log(arg2);
      const unit = await this.unitService.create(arg2);
      req.body.unit = unit;
      req.body.final = formatResponse(unit, HttpStatusCode.Created,'Created unit');
      console.log(req.body);
      next()
    } catch (e) {
      next(e)
    }
  }

  public getUnit = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const unit = await this.unitService.getUnit(id);
      this.send(res, unit, HttpStatusCode.Ok, 'gotUnit:'+id )
    } catch (e) {
      next(e)
    }
  }

  public getAll = async (
    req: Request,
    res: CustomResponse<Unit[]>,
    next: NextFunction
  ) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
  
      const unitList = await this.unitService.getUnits(limit, offset);
      this.send(res, unitList, HttpStatusCode.Ok, 'gotAllUnits');
    } catch (e) {
      next(e);
    }
  };
  

  public updateUnitName = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { name } = req.query;  
      if (typeof name == 'string') {
        const updatedUnit = await this.unitService.updateUnitName(id, name);
        this.send(res, updatedUnit, HttpStatusCode.Ok, 'updatedUnitName');
      } 
    } catch (e) {
      next(e);
    }
  }

  public delete = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const unit = await this.unitService.delete(id);
      this.send(res, unit, HttpStatusCode.Ok, 'deletedUnit' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<Unit[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.unitService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllUnits' )
    } catch (e) {
      next(e)
    }
  };


  public createAssignment = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { unitId } = req.params;
      const assignmentData = req.body;
      const newAssignment = await this.unitService.createAssignment(unitId, assignmentData);
      this.send(res, newAssignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      next(e);
    }
  };

  
  public getAssignments = async (
    req: Request,
    res: CustomResponse<Assignment[]>,
    next: NextFunction
  ) => {
    try {
      const { unitId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const assignments = await this.unitService.getAssignments(unitId, limit, offset);
      this.send(res, assignments, HttpStatusCode.Ok, 'gotAssignments');
    } catch (e) {
      next(e);
    }
  };


}