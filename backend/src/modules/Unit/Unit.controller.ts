import { type NextFunction, type Request } from 'express';
import { type Assignment, type Unit } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UnitService from './Unit.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { ExtendedRequest } from '@/types/express';

export default class UnitController extends Api {
  private readonly unitService = new UnitService();

  public create = async (
    req: ExtendedRequest,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      console.log("create unit controller", req.body);
  
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({ message: 'User not authenticated', data: { id: '', name: '', year: 0, ownerId: '' } });
      }
  
     
      const newUnitData = {
        ...req.body,
        ownerId,
      };
  
      const newUnit = await this.unitService.create(newUnitData);
      this.send(res, newUnit, HttpStatusCode.Created, 'createUnit');
    } catch (e) {
      next(e);
    }
  };

  public getAll = async (
    req: ExtendedRequest,
    res: CustomResponse<Unit[]>,
    next: NextFunction
  ) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({ message: 'User not authenticated', data: [] });
      }

      const unitList = await this.unitService.getUnits(ownerId, limit, offset);
      this.send(res, unitList, HttpStatusCode.Ok, 'gotAllUnits');
    } catch (e) {
      next(e);
    }
  };

  public getUnit = async (
    req: ExtendedRequest,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({ message: 'User not authenticated', data: { id: '', name: '', year: 0, ownerId: '' } });
      }

      const unit = await this.unitService.getUnit(ownerId, id);
      if (!unit) {
        return res.status(HttpStatusCode.NotFound).json({ message: 'Unit not found or not accessible', data: { id: '', name: '', year: 0, ownerId: '' } });
      }

      this.send(res, unit, HttpStatusCode.Ok, 'gotUnit:' + id);
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
