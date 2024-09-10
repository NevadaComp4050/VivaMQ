import { Router } from 'express';
import Controller from './Assignment.controller';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import { CreateSubmissionDto } from '@/dto/submission.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import multer from 'multer';
import { create } from 'domain';

const assignments: Router = Router();
const controller = new Controller();

const upload = multer({ dest: 'uploads/' });

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

/**
 * POST /assignments
 * @summary Create a new assignment
 * @tags Assignment
 * @param {CreateAssignmentBody} request.body.required - CreateAssignmentDto
 * @return {Assignment} 201 - Assignment created
 */
assignments.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(CreateAssignmentDto),
  controller.createAssignment
);

/**
 * POST /assignments/:assignmentId/submissions
 * @summary Create a submission
 * @tags Submissions
 * @param {file} file.required - The submission file
 * @return {Submission} 201 - Submission created
 */
assignments.post(
  '/:assignmentId/submissions',
  verifyAuthToken,
  RequestValidator.validate(CreateSubmissionDto),
  upload.single('submissionFile'),
  controller.createSubmission
);

/**
 * GET /assignments/:assignmentId/submissions
 * @summary Get all submissions for an assignment
 * @tags Submissions
 * @param {integer} limit.query - Limit
 * @param {integer} offset.query - Offset
 * @return {Array.<Submission>} 200 - submission list
 */
assignments.get(
  '/:assignmentId/submissions',
  verifyAuthToken,
  controller.getSubmissions
);

export default assignments;
