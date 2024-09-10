import { type NextFunction, type Request } from 'express';
import { type Assignment, type Unit } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UnitService from './Unit.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class UnitController extends Api {
  private readonly unitService = new UnitService();

  public createUnit = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const newUnit = await this.unitService.createUnit(req.body);
      this.send(res, newUnit, HttpStatusCode.Created, 'createUnit');
    } catch (e) {
      next(e);
    }
  };

  public getallunits = async (
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
  

  public getUnit = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const unit = await this.unitService.getUnit(id);
      this.send(res, unit, HttpStatusCode.Ok, 'gotUnit');
    } catch (e) {
      next(e);
    }
  };

  public deleteUnit = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const user = await this.unitService.deleteUnit(id);
      this.send(res, user, HttpStatusCode.Ok, 'deletedUnit' )
    } catch (e) {
      next(e)
    }
  }

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