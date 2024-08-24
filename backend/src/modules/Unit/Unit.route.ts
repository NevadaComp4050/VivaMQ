import { Router } from 'express';
import Controller from './Unit.controller';
import { CreateUnitDto } from '@/dto/unit.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const units: Router = Router();
const controller = new Controller();

// Define CreateUnitBody
// Comments after property do render
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

// Use CreateUnitBody
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
  controller.createUnit
);

/**
 * GET /units/getall
 * @summary Get all unit data
 * @tags Unit
 * @param None
 * @return {Array.<Unit>} 200 - unit list
 */
units.get(
  '/getall',
  verifyAuthToken,
  controller.getallunits
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

// TODO this needs to be modified
export default units;
