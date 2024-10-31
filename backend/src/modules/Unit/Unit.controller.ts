import { type NextFunction, type Request } from 'express';
import { type Unit, type Assignment, AccessRole } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { Term } from '@prisma/client';
import UnitService from './Unit.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import { type ExtendedRequest } from '@/types/express';

export default class UnitController extends Api {
  private readonly unitService = new UnitService();

  public create = async (
    req: ExtendedRequest,
    res: CustomResponse<Unit | null>,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'User not authenticated',
          data: null,
        });
      }

      const { name, year, term } = req.body;

      console.log('Creating unit:', name, year, term);

      // Ensure term matches the Term enum type
      if (!name || !year || !Object.values(Term).includes(term)) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Name, valid term, and year are required.',
          data: null,
        });
      }

      // Cast year to an integer
      const yearInt = parseInt(year, 10);
      if (isNaN(yearInt)) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Year must be a valid number.',
          data: null,
        });
      }

      const newUnitData = {
        name,
        year: yearInt,
        term,
        ownerId,
      };

      const newUnit = await this.unitService.create(newUnitData);
      this.send(res, newUnit, HttpStatusCode.Created, 'createUnit');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public getAll = async (
    req: ExtendedRequest,
    res: CustomResponse<Unit[] | null>,
    next: NextFunction
  ) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const ownerId = req.user?.id;
      if (!ownerId) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .json({ message: 'User not authenticated', data: null });
      }

      const unitList = await this.unitService.getUnits(ownerId, limit, offset);
      this.send(res, unitList, HttpStatusCode.Ok, 'gotAllUnits');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public getUnit = async (
    req: ExtendedRequest,
    res: CustomResponse<Unit | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'User not authenticated',
          data: null,
        });
      }

      // Fetch the unit with all required details
      const unit = await this.unitService.getUnitWithDetails(ownerId, id);
      if (!unit) {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Unit not found or not accessible',
          data: null,
        });
      }

      this.send(res, unit, HttpStatusCode.Ok, 'gotUnit:' + id);
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public getUnitsGroupedBySession = async (
    req: ExtendedRequest,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'User not authenticated',
          data: null,
        });
      }
      const unitsGroupedBySession =
        await this.unitService.getUnitsGroupedBySession(userId);
      if (!unitsGroupedBySession || unitsGroupedBySession.length === 0) {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'No units found',
          data: null,
        });
      }

      this.send(
        res,
        unitsGroupedBySession,
        HttpStatusCode.Ok,
        'gotUnitsGroupedBySession'
      );
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public updateUnitName = async (
    req: Request,
    res: CustomResponse<Unit | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { name } = req.query;

      if (typeof name === 'string') {
        const updatedUnit = await this.unitService.updateUnitName(id, name);
        this.send(res, updatedUnit, HttpStatusCode.Ok, 'updatedUnitName');
      } else {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Invalid name parameter',
          data: null,
        });
      }
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public updateUnitDetails = async (
    req: Request,
    res: CustomResponse<Unit | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { name, term, year } = req.body;

      // Ensure at least one field is provided for update
      if (!name && !term && !year) {
        return res.status(HttpStatusCode.BadRequest).json({
          message:
            'At least one field (name, term, or year) is required to update.',
          data: null,
        });
      }

      // Validate the 'year' field if it's provided
      let yearInt;
      if (year) {
        yearInt = parseInt(year, 10);
        if (isNaN(yearInt)) {
          return res.status(HttpStatusCode.BadRequest).json({
            message: 'Year must be a valid number.',
            data: null,
          });
        }
      }

      // Validate 'term' if provided
      if (term && !Object.values(Term).includes(term)) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Invalid term value.',
          data: null,
        });
      }

      // Call the service to update the unit
      const updatedUnit = await this.unitService.updateUnitDetails(id, {
        name,
        term,
        year: yearInt,
      });
      if (!updatedUnit) {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Unit not found or update failed.',
          data: null,
        });
      }

      this.send(res, updatedUnit, HttpStatusCode.Ok, 'updatedUnitDetails');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<Unit | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const unit = await this.unitService.delete(id);
      this.send(res, unit, HttpStatusCode.Ok, 'deletedUnit');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public deleteAll = async (
    req: Request,
    res: CustomResponse<number | null>,
    next: NextFunction
  ) => {
    try {
      const count = await this.unitService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllUnits');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public createAssignment = async (
    req: Request,
    res: CustomResponse<Assignment | null>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const assignmentData = req.body;

      // Validate that 'id' is provided
      if (!id) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Unit ID is required',
          data: null,
        });
      }

      const newAssignment = await this.unitService.createAssignment(
        id,
        assignmentData
      );

      this.send(res, newAssignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  public getAssignments = async (
    req: Request,
    res: CustomResponse<Assignment[] | null>,
    next: NextFunction
  ) => {
    try {
      const { unitId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const assignments = await this.unitService.getAssignments(
        unitId,
        limit,
        offset
      );
      this.send(res, assignments, HttpStatusCode.Ok, 'gotAssignments');
    } catch (e) {
      console.error(e);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  // Share a unit with a user
  public shareUnit = async (
    req: ExtendedRequest,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user?.id;
      const unitId = req.params.id;
      const { email, role } = req.body;

      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'User not authenticated',
          data: null,
        });
      }

      if (!email) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Email is required',
          data: null,
        });
      }

      const accessRole = role || AccessRole.READ_ONLY;

      const result = await this.unitService.shareUnitWithUser(
        ownerId,
        unitId,
        email,
        accessRole
      );

      this.send(res, result, HttpStatusCode.Ok, 'unitShared');
    } catch (e: any) {
      console.error(e);
      if (e.message === 'User not found') {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'User does not exist',
          data: null,
        });
      } else if (e.message === 'Unit already shared with this user') {
        return res.status(HttpStatusCode.Conflict).json({
          message: 'Unit already shared with this user',
          data: null,
        });
      } else if (e.message === 'Unit not found or access denied') {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Unit not found or access denied',
          data: null,
        });
      }
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  // Get list of users with access to the unit
  public getUnitSharers = async (
    req: ExtendedRequest,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user?.id;
      const unitId = req.params.id;

      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'User not authenticated',
          data: null,
        });
      }

      const sharers = await this.unitService.getUnitSharers(ownerId, unitId);

      this.send(res, sharers, HttpStatusCode.Ok, 'gotUnitSharers');
    } catch (e: any) {
      console.error(e);
      if (e.message === 'Unit not found or access denied') {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Unit not found or access denied',
          data: null,
        });
      }
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };

  // Remove a user's access to the unit
  public deleteUnitShare = async (
    req: ExtendedRequest,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user?.id;
      const unitId = req.params.id;
      const userId = req.params.userId;

      if (!ownerId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: 'User not authenticated',
          data: null,
        });
      }

      const result = await this.unitService.removeUnitShare(
        ownerId,
        unitId,
        userId
      );

      this.send(res, result, HttpStatusCode.Ok, 'unitShareRemoved');
    } catch (e: any) {
      console.error(e);
      if (e.message === 'Unit not found or access denied') {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Unit not found or access denied',
          data: null,
        });
      } else if (e.message === 'Access not found') {
        return res.status(HttpStatusCode.NotFound).json({
          message: 'Access not found',
          data: null,
        });
      }
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'An error occurred', data: null });
    }
  };
}
