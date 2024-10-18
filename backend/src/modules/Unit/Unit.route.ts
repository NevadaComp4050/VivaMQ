import { Router } from 'express';
import Controller from './Unit.controller';
import { CreateUnitDto } from '@/dto/unit.dto';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import {
  VerifyUnitReadAccess,
  VerifyUnitReadWriteAccess,
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
 * GET /units/grouped-by-session
 * @summary Get all units grouped by session
 * @tags Unit
 */
units.get('/by-session', verifyAuthToken, controller.getUnitsGroupedBySession);

/**
 * GET /units/{id}
 * @summary Get a single unit
 * @tags Unit
 */
units.get('/:id', verifyAuthToken, VerifyUnitReadAccess, controller.getUnit);

/**
 * PUT /units/update-name/{id}
 * @summary Update unit name
 * @tags Unit
 */
units.put(
  '/update-name/:id',
  verifyAuthToken,
  VerifyUnitReadWriteAccess,
  controller.updateUnitName
);

/**
 * DELETE /units/{id}
 * @summary Delete a single unit
 * @tags Unit
 */
units.delete(
  '/:id',
  verifyAuthToken,
  VerifyUnitReadWriteAccess,
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
  '/:unitId/assignments',
  verifyAuthToken,
  VerifyUnitReadWriteAccess,
  RequestValidator.validate(CreateAssignmentDto),
  controller.createAssignment
);

/**
 * GET /units/{unitId}/assignments
 * @summary Get all assignments for a specific unit with pagination
 * @tags Assignment
 */
units.get(
  '/:unitId/assignments',
  verifyAuthToken,
  VerifyUnitReadWriteAccess,
  controller.getAssignments
);

export default units;
