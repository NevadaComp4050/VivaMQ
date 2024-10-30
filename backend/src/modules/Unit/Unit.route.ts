import { Router } from 'express';
import Controller from './Unit.controller';
import { CreateUnitDto } from '@/dto/unit.dto';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import {
  verifyUnitReadAccess,
  verifyUnitReadWriteAccess,
} from '@/middlewares/access-control/unit-access';

const units: Router = Router();
const controller = new Controller();

/**
 * POST /units
 * @summary Create unit
 * @tags Unit
 */
units.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(CreateUnitDto),
  controller.create
);

/**
 * GET /units
 * @summary Get all unit data with pagination
 * @tags Unit
 */
units.get('/', verifyAuthToken, controller.getAll);

/**
 * GET /units/by-session
 * @summary Get all units grouped by session
 * @tags Unit
 */
units.get('/by-session', verifyAuthToken, controller.getUnitsGroupedBySession);

/**
 * GET /units/{id}
 * @summary Get a single unit
 * @tags Unit
 */
units.get('/:id', verifyAuthToken, verifyUnitReadAccess, controller.getUnit);

/**
 * PUT /units/update-name/{id}
 * @summary Update unit name
 * @tags Unit
 */
units.put(
  '/update-name/:id',
  verifyAuthToken,
  verifyUnitReadWriteAccess,
  controller.updateUnitName
);

/**
 * PATCH /units/{id}
 * @summary Update unit details
 * @tags Unit
 */
units.patch(
  '/:id',
  verifyAuthToken,
  verifyUnitReadWriteAccess,
  controller.updateUnitDetails
);

/**
 * DELETE /units/{id}
 * @summary Delete a single unit
 * @tags Unit
 */
units.delete(
  '/:id',
  verifyAuthToken,
  verifyUnitReadWriteAccess,
  controller.delete
);

/**
 * DELETE /units
 * @summary Delete all units
 * @tags Unit
 */
units.delete('/', verifyAuthToken, controller.deleteAll);

/**
 * POST /units/{unitId}/assignments
 * @summary Create an assignment under a specific unit
 * @tags Assignment
 */
units.post(
  '/:id/assignments',
  verifyAuthToken,
  verifyUnitReadWriteAccess,
  RequestValidator.validate(CreateAssignmentDto),
  controller.createAssignment
);

/**
 * GET /units/{unitId}/assignments
 * @summary Get all assignments for a specific unit with pagination
 * @tags Assignment
 */
units.get(
  '/:id/assignments',
  verifyAuthToken,
  verifyUnitReadAccess,
  controller.getAssignments
);

// TODO: Share units woth other users

export default units;
