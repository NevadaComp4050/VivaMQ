import { Router } from 'express';
import AssignmentController from './assignments.controller';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const assignments: Router = Router();
const controller = new AssignmentController();

/**
 * Create assignment body
 * @typedef {object} CreateAssignmentBody
 * @property {string} name.required - Name of the assignment
 * @property {string} unit.required - Unit of the assignment
 * @property {string} description.required - Description of the assignment
 */
/**
 * Assignment
 * @typedef {object} Assignment
 * @property {string} name - Name of the assignment
 * @property {string} unit - Unit of the assignment
 * @property {string} description - Description of the assignment
 */

/**
 * POST /assignments/create
 * Create a new assignment
 * @tags assignments
 * @param {CreateAssignmentBody} request.body.required
 * @return {Assignment} 201 - Assignment created
 */
assignments.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateAssignmentDto),
  controller.createAssignment
);

/**
 * GET /assignments/getall
 * Get all assignments
 * @tags assignments
 * @return {Array.<Assignment>} 200 - List of assignments
 */
assignments.get(
  '/getall',
  verifyAuthToken,
  controller.getAllAssignments
);

export default assignments;