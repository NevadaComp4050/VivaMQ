import { type NextFunction, type Request } from 'express';
import { type Assignment, type Unit } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UnitService from './Unit.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { formatResponse , filterFields} from '../../utils/mutantRequestFormat'

// TODO describe behaviour
/**
 * To delete a Unit all assignments of that unit must be deleted.
 * To Create a Unit a User must exist for it to be assigned to.
 */


// Ridiculous Typescript nonsense, compile time its there, runtime it isnt
// const allowedFields = Object.keys({} as Unit) as (keyof Unit)[];
/** Will only keep these fields */
const allowedFields = ["name" , "id" , "year" , "convenorId"] as (keyof Unit)[];


export default class UnitController extends Api {
  private readonly unitService = new UnitService();

    // Function that reads the final response from req.body
  /**
   * Use this function to send the final response using request.
   * It is possible to use this as an echo if there is a route
   * with nothing but this funtion and the request contains final.
   * @param req Contains final: {data, HttpResponse, message}
   * @param res 
   * @param next 
   */
  public sendFinal = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      this.send(
        res,
        req.body.final.data,
        req.body.final.httpCode,
        req.body.final.message
      )
    } catch (e){
      next(e)
    }
  }

  // TODO DELETE this?
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
      console.log(arg);
      const arg2 = filterFields<Unit>(arg,allowedFields)
      console.log('got here')
      console.log(arg2);
      // TODO this works, but the compiler doesn't like it
      const unit = await this.unitService.create(arg2);
      req.body.unit = unit;
      req.body.final = formatResponse(unit, 
        HttpStatusCode.Created,'Created unit');
      console.log(req.body);
      next()
    } catch (e) {
      next(e)
    }
  }

  /**
   * Search params, then req.body.unit.id, then req.body.id for an id
   * use this for retrieval.
   * @param req 
   * @param res 
   * @param next 
   */
  public getUnit = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      let { id } = req.params;
      if(!id){
        id = req.body.unit.id
      }
      if(!id){
        id = req.body.id
      }
      const unit = await this.unitService.getUnit(id);

      req.body.unit = unit;
      req.body.final = formatResponse(unit, 
        HttpStatusCode.Ok,'gotUnit:'+id);
      console.log(req.body);
      next()

      //this.send(res, unit, HttpStatusCode.Ok, 'gotUnit:'+id )
    } catch (e) {
      next(e)
    }
  }

  // TODO test this
  public getAll = async (
    req: Request,
    res: CustomResponse<Unit[]>,
    next: NextFunction
  ) => {
    try {
      // TODO use more of this behaviour
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const unitList = await this.unitService.getUnits(limit, offset);

      req.body.unitlist = unitList;
      req.body.final = formatResponse(unitList, 
        HttpStatusCode.Ok, 'gotManyUnits');
      console.log(req.body);
      next()

      //this.send(res, unitList, HttpStatusCode.Ok, 'gotAllUnits');
    } catch (e) {
      next(e);
    }
  };
  
  // TODO Test this
  public updateUnit = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      let { id } = req.params;
      const data = req.query;
      // TODO cover this case
      // if(!id && data.id){
      //   id = data.id;
      // }
      if(!id){
        id = req.body.Unit.id
      }
      let data2 = filterFields<Unit>(data,allowedFields);
      data2.id = id;
      //if (typeof name == 'string') {
      // TODO this works, but the compiler doesn't like it
        const unit = await this.unitService.updateUnit(data2);
        req.body.unit = unit;
        req.body.final = formatResponse(unit, 
          HttpStatusCode.Ok,'gotUnit:'+id);
        console.log(req.body);
        next();

        //this.send(res, unit, HttpStatusCode.Ok, 'updatedUnitName');
      //} 
    } catch (e) {
      next(e);
    }
  }

  // TODO complete this properly
  // TODO test this
  public delete = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      let { id } = req.params;
      if(!id){
        id = req.body.unit.id;
      }
      if(!id){
        id = req.body.id
      }
      const unit = await this.unitService.delete(id);
      req.body.unit = unit;
      req.body.final = formatResponse(unit, 
        HttpStatusCode.Ok,'deletedUnit:'+id);
      console.log(req.body);
      next();

      //this.send(res, unit, HttpStatusCode.Ok, 'deletedUnit' )
    } catch (e) {
      next(e)
    }
  }

  // TODO Turns this into a query that deletes ones we dont like
  public deleteAll = async (
    req: Request,
    res: CustomResponse<Unit[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.unitService.deleteAll();

      req.body.unit = count;
      req.body.final = formatResponse(count, 
        HttpStatusCode.Ok,'deletedAllUnits:'+count);
      console.log(req.body);
      next();

      //this.send(res, count, HttpStatusCode.Ok, 'deletedAllUnits' )
    } catch (e) {
      next(e)
    }
  };

  // This no longer needs to be here

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