import { Router } from 'express';
import SubmissionController from './Submission.controller';
import { verifyAuthToken } from '@/middlewares/auth';

const submissions: Router = Router();
const controller = new SubmissionController();

/**
 * GET /api/submissions/{submissionId}/viva-questions
 * @summary Retrieve viva questions for a specific submission
 * @tags VivaQuestion
 * @param {string} submissionId.path.required - Submission ID
 * @return {Array.<VivaQuestion>} 200 - List of viva questions
 */
submissions.get(
  '/:submissionId/viva-questions',
  verifyAuthToken,
  controller.getVivaQuestions
);

/**
 * POST /api/submissions/{submissionId}/generate-viva-questions
 * @summary Trigger generation of viva questions for a specific submission
 * @tags VivaQuestion
 * @param {string} submissionId.path.required - Submission ID
 * @return {string} 202 - Viva questions generation initiated
 */
submissions.post(
  '/:submissionId/generate-viva-questions',
  verifyAuthToken,
  controller.generateVivaQuestions
);

/**
 * GET /api/submissions/export-viva-questions
 * @summary Export viva questions for all submissions
 * @tags VivaQuestion
 * @param {string} format.query.required - Format (csv or pdf)
 * @return {string} 501 - Not implemented
 */
submissions.get(
  '/export-viva-questions',
  verifyAuthToken,
  controller.exportVivaQuestions
);

/**
 * DELETE /submissions/{id}
 * @summary Delete a single submission
 * @tags Submission
 * @param {string} id.path.required - ID of the submission to delete
 * @return {Submission} 200 - submission list
 */
submissions.delete('/:id', verifyAuthToken, controller.delete);

/**
 * DELETE /submissions/
 * @summary Delete all submission data
 * @tags Submission
 * @param None
 * @return {number} 200 - submission clear
 */
submissions.delete('/', verifyAuthToken, controller.deleteAll);

/**
 * GET /submissions/{id}/pdf
 * @summary Fetch a submission PDF
 * @tags Submission
 * @param {string} id.path.required - ID of the submission to fetch PDF for
 * @return {file} 200 - submission PDF
 */
submissions.get('/:id/file', controller.getSubmissionPDF);

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
submissions.post('/bulkSubmissionMapping', controller.mapMultipleSubmissions);

export default submissions;
