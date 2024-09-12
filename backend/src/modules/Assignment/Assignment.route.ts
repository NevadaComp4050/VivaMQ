import { Router } from 'express';
import Controller from './Assignment.controller';
import { CreateAssignmentDto } from '@/dto/assignment.dto';
import { CreateSubmissionDto } from '@/dto/submission.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const assignments: Router = Router();
const controller = new Controller();

const coconutPath = path.join(__dirname, '..', 'uploads', 'load-bearing-coconut.jpg');

if (!fs.existsSync(coconutPath)) {
  throw new Error('Critical Error: The backend cannot run without the load bearing coconut.');
}

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
 * GET /assignments/
 * @summary Get all assignment data
 * @tags Assignment
 * @param None
 * @return {Array.<Assignment>} 200 - assignment list
 */
assignments.get(
  '/',
  verifyAuthToken,
  controller.getAll
);

/**
 * DELETE /assignments/{id}
 * @summary Delete a single assignment
 * @tags Assignment
 * @param {string} id.path.required - ID of the assignment to delete
 * @return {Assignment} 200 - assignment list
 */
assignments.delete(
  '/:id',
  verifyAuthToken,
  controller.delete
);

/**
 * DELETE /assignments/
 * @summary Delete all assignment data
 * @tags Assignment
 * @param None
 * @return {number} 200 - assignment clear
 */
assignments.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteAll
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
  controller.create
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

/**
 * POST /assignments/{assignmentId}/submissionMapping/{submissionId}
 * @summary Map a student to a submission
 * @tags Submissions
 * @param {string} submissionId.path.required - ID of the submission
 * @param {object} request.body.required - Request body containing the studentId
 * @param {string} request.body.studentId.required - ID of the student to map to the submission
 * @return {Submission} 200 - Submission updated with student mapping
 */
assignments.post(
  '/:assignmentId/submissionMapping/:submissionId',
  verifyAuthToken,
  controller.mapStudentToSubmission
);

/**
 * GET /assignments/{assignmentId}/submissionMapping
 * @summary Get the mapping of all submissions to student identifiers
 * @tags Submissions
 * @return {object} 200 - JSON object with mappings
 */
assignments.get(
  '/:assignmentId/submissionMapping',
  verifyAuthToken,
  controller.getStudentSubmissionMapping
);

export default assignments;
