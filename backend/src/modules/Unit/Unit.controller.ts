import { type NextFunction, type Request } from 'express';
import { type Unit } from '@prisma/client';
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
      const unitList = await this.unitService.getUnits();
      this.send(res, unitList, HttpStatusCode.Ok, 'gotAllUnits');
    } catch (e) {
      next(e);
    }
  };

  public deleteallunits = async (
    req: Request,
    res: CustomResponse<Unit[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.unitService.deleteUnits();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllUnits' )
    } catch (e) {
      next(e)
    }
  }

  public getUnitById = async (
    req: Request,
    res: CustomResponse<Unit>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const unit = await this.unitService.getUnitById(id);
      this.send(res, unit, HttpStatusCode.Ok, 'gotUnitById');
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
  };
}