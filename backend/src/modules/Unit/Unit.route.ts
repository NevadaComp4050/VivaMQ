import { Router } from 'express';
import Controller from './Unit.controller';
import { CreateUnitDto } from '@/dto/unit.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const units: Router = Router();
const controller = new Controller();

/**
 * Create unit body
 * @typedef {object} CreateUnitBody
 * @property {string} name.required - name of unit
 * @property {number} year.required - year of unit
 * @property {string} convenorId.required - ID of convenor of unit
 */
/**
 * Unit
 * @typedef {object} Unit
 * @property {string} id - unique ID
 * @property {string} name - name of unit
 * @property {number} year - year of unit
 * @property {string} convenorId - ID of convenor of unit
 * @property {user} convenor - convenor of unit
 */

/**
 * POST /units/create
 * @summary Create unit
 * @tags Unit
 * @param {CreateUnitBody} request.body.required
 * @return {Unit} 201 - unit created
 */
units.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateUnitDto),
  controller.create
);

/**
 * GET /units/{id}
 * @summary Get a single unit
 * @tags Unit
 * @param {string} id.path.required
 * @return {Unit} 200 - unit list
 */
units.get(
  '/:id',
  verifyAuthToken,
  controller.get
);

/**
 * GET /units/
 * @summary Get all unit data
 * @tags Unit
 * @param None
 * @return {Array.<Unit>} 200 - unit list
 */
units.get(
  '/',
  verifyAuthToken,
  controller.getAll
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
 * DELETE /units/{id}
 * @summary Delete a single unit
 * @tags Unit
 * @param {string} id.path.required - ID of the unit to delete
 * @return {Unit} 200 - unit list
 */
units.delete(
  '/:id',
  verifyAuthToken,
  controller.delete
);

/**
 * DELETE /units/
 * @summary Delete all unit data
 * @tags Unit
 * @param None
 * @return {number} 200 - unit clear
 */
units.delete(
  '/',
  verifyAuthToken,
  controller.deleteAll
);

export default units;