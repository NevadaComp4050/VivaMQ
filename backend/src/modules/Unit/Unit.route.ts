import { Router } from 'express';
import Controller from './Unit.controller';
import { CreateUnitDto } from '@/dto/unit.dto';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const units: Router = Router();
const controller = new Controller();

/**
 * @typedef {object} Unit
 * @property {string} id - unique ID
 * @property {string} name - name of unit
 * @property {number} year - year of unit
 * @property {string} convenorId - ID of convenor of unit
 * @property {user} convenor - convenor of unit
 */

/**
 * @typedef {object} Assignment
 * @property {string} id - Unique ID of the assignment
 * @property {string} name - Name of the assignment
 * @property {string} aiModel - AI model used for the assignment
 * @property {string} specs - Specifications of the assignment
 * @property {string} settings - Settings for the assignment
 * @property {string} unitId - ID of the unit to which the assignment belongs
 */

/**
 * @typedef {object} CreateAssignmentBody
 * @property {string} name.required - Name of the assignment
 * @property {string} aiModel.required - AI model used for the assignment
 * @property {string} specs.required - Specifications of the assignment
 * @property {string} settings.required - Settings for the assignment
 */

/**
 * POST /units
 * @summary Create unit
 * @tags Unit
 * @param {CreateUnitBody} request.body.required
 * @return {Unit} 201 - unit created
 */
units.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(CreateUnitDto),
  controller.createUnit
);

/**
 * GET /units
 * @summary Get all unit data with pagination
 * @tags Unit
 * @param {number} limit.query - The number of units to return (pagination)
 * @param {number} offset.query - The number of units to skip (pagination)
 * @return {Array.<Unit>} 200 - unit list
 */
units.get(
  '/',
  verifyAuthToken,
  controller.getallunits
);

/**
 * GET /units/{id}
 * @summary Get single unit data
 * @tags Unit
 * @param {string} id.path.required - ID of the unit to retrieve
 * @return {Unit} 200 - unit data
 */
units.get(
  '/:id',
  verifyAuthToken,
  controller.getUnitById
);

/**
 * GET /units/deleteall
 * @summary Delete all unit data
 * @tags Unit
 * @param None
 * @return {number} 200 - unit list
 */
units.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteallunits
);

/**
 * PUT /units/update-name/{id}
 * @summary Update unit name
 * @tags Unit
 * @param {string} id.path.required - ID of the unit to update
 * @param {string} name.query.required - New name for the unit
 * @return {Unit} 200 - unit updated
 */
units.put(
  '/update-name/:id',
  verifyAuthToken,
  controller.updateUnitName
);

/**
 * POST /units/{unitId}/assignments
 * @summary Create an assignment under a specific unit
 * @tags Assignment
 * @param {string} unitId.path.required - ID of the unit to create assignment for
 * @param {CreateAssignmentBody} request.body.required - Assignment data
 * @return {Assignment} 201 - Assignment created
 */
units.post(
  '/:unitId/assignments',
  verifyAuthToken,
  RequestValidator.validate(CreateAssignmentDto),  // Validate the CreateAssignmentBody
  controller.createAssignment
);

/**
 * GET /units/{unitId}/assignments
 * @summary Get all assignments for a specific unit with pagination
 * @tags Assignment
 * @param {string} unitId.path.required - ID of the unit to retrieve assignments for
 * @param {number} limit.query - Number of assignments to return (pagination)
 * @param {number} offset.query - Number of assignments to skip (pagination)
 * @return {Array.<Assignment>} 200 - List of assignments
 */
units.get(
  '/:unitId/assignments',
  verifyAuthToken,
  controller.getAssignments
);

export default units;
