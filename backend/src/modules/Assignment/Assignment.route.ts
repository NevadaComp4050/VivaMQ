import { Router } from 'express';
import multer from 'multer';
import Controller from './assignment.controller';
import { verifyAuthToken } from '@/middlewares/auth';
import {
  VerifyAssignmentReadWriteAccess,
  VerifyAssignmentReadAccess,
} from '@/middlewares/access-control/assignment-access';

const assignments: Router = Router();
const controller = new Controller();

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
 * GET /assignments/{id}/details
 * @summary Get assignment details along with submissions
 * @tags Assignment
 * @param {string} id.path.required - ID of the assignment
 * @return {Assignment} 200 - Assignment details with submissions
 */
assignments.get(
  '/:id',
  verifyAuthToken,
  VerifyAssignmentReadAccess,
  controller.getAssignmentWithSubmissions
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
  VerifyAssignmentReadWriteAccess,
  controller.delete
);

/**
 * POST /assignments/:assignmentId/submissionUpload
 * @summary Create a submission
 * @tags Submissions
 * @param {file} file.required - The submission file
 * @return {Submission} 201 - Submission created
 */
assignments.post(
  '/:id/submissionUpload',
  verifyAuthToken,
  VerifyAssignmentReadWriteAccess,
  upload.single('file'),
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
  '/:id/submissions',
  verifyAuthToken,
  VerifyAssignmentReadAccess,
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
  '/:id/submissionMapping/:submissionId',
  verifyAuthToken,
  VerifyAssignmentReadWriteAccess,
  controller.mapStudentToSubmission
);

/**
 * GET /assignments/{assignmentId}/submissionMapping
 * @summary Get the mapping of all submissions to student identifiers
 * @tags Submissions
 * @return {object} 200 - JSON object with mappings
 */
assignments.get(
  '/:id/submissionMapping',
  verifyAuthToken,
  VerifyAssignmentReadAccess,
  controller.getStudentSubmissionMapping
);

/**
 * POST /assignments/{assignmentId}/bulkSubmissionMapping
 * @summary Map multiple students to submissions
 * @tags Submissions
 * @param {object} request.body.required - Request body containing an array of mappings
 * @param {Array.<object>} request.body.mappings.required - Array of mappings
 * @param {string} request.body.mappings[].submissionId.required - ID of the submission
 * @param {string} request.body.mappings[].studentId.required - ID of the student
 * @return {Array.<Submission>} 200 - Submissions updated with student mappings
 */
assignments.post(
  '/:id/bulkSubmissionMapping',
  verifyAuthToken,
  VerifyAssignmentReadWriteAccess,
  controller.mapMultipleSubmissions
);

/**
 * POST /assignments/{assignmentId}/generateViva
 * @summary Trigger viva generation for a particular assignment
 * @tags Viva
 * @param {string} assignmentId.path.required - ID of the assignment
 * @return {object} 200 - JSON object indicating success or failure
 */
assignments.post(
  '/:id/generateVivaQuestions',
  controller.generateVivaQuestions
);

export default assignments;
