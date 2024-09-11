import { type NextFunction, type Request } from 'express';
import { type Unit } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UnitService from './Unit.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class UnitController extends Api {
  private readonly unitService = new UnitService();

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

  public get = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const unit = await this.unitService.get(id);
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
      const unitList = await this.unitService.getAll();
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
}