import { Router } from 'express';
import Controller from './Assignment.controller';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const assignments: Router = Router();
const controller = new Controller();

/**
 * Create assignment body
 * @typedef {object} CreateAssignmentBody
 * @property {string} name.required - name of assignment
 * @property {string} aiModel.required - AI model
 * @property {string} specs.required - specs
 * @property {string} settings.required - settings
 * @property {string} unitId.required - ID of unit of assignment
 */
/**
 * Assignment
 * @typedef {object} Assignment
 * @property {string} id - unique ID
 * @property {string} name - name of assignment
 * @property {string} aiModel - AI model
 * @property {string} specs - specs
 * @property {string} settings - settings
 * @property {string} unitId - ID of unit of assignment
 * @property {unit} unit - unit of assignment
 */

/**
 * POST /assignments/create
 * @summary Create assignment
 * @tags Assignment
 * @param {CreateAssignmentBody} request.body.required
 * @return {Assignment} 201 - assignment created
 */
assignments.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateAssignmentDto),
  controller.createAssignment
);

/**
 * GET /assignments/getall
 * @summary Get all assignment data
 * @tags Assignment
 * @param None
 * @return {Array.<Assignment>} 200 - assignment list
 */
assignments.get(
  '/getall',
  verifyAuthToken,
  controller.getallassignments
);

/**
 * GET /assignments/deleteall
 * @summary Delete all assignment data
 * @tags Assignment
 * @param None
 * @return {number} 200 - assignment clear
 */
assignments.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteallassignments
);

export default assignments;