import { Router } from 'express';
import Controller from './Submission.controller';
// import { CreateSubmissionDto } from '@/dto/submission.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const submissions: Router = Router();
const controller = new Controller();

/**
 * Create submission body
 * @typedef {object} CreateSubmissionBody
 * @property {string} assignmentId.required - ID of assignment of submission
 * @property {string} studentId.required - ID of student of assignment
 * @property {string} submissionFile.required - submission file
 * @property {string} status.required - status of submission
 */
/**
 * Submission
 * @typedef {object} Submission
 * @property {string} id - unique ID
 * @property {string} assignmentId - ID of assignment of submission
 * @property {string} studentId - ID of student of assignment
 * @property {string} submissionFile - submission file
 * @property {string} status - status of submission
 * @property {Assignment} assignment - assignment of submission
 * @property {Student} student - student pf submission
 */

/**
 * POST /submissions/create
 * @summary Create submission
 * @tags Submission
 * @param {CreateSubmissionBody} request.body.required
 * @return {Submission} 201 - submission created
 */
submissions.post(
  '/create',
  verifyAuthToken,
  controller.createSubmission
);

/**
 * GET /submissions/getall
 * @summary Get all submission data
 * @tags Submission
 * @param None
 * @return {Array.<Submission>} 200 - submission list
 */
submissions.get(
  '/getall',
  verifyAuthToken,
  controller.getallsubmissions
);

/**
 * GET /submissions/deleteall
 * @summary Delete all submission data
 * @tags Submission
 * @param None
 * @return {number} 200 - submission clear
 */
submissions.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteallsubmissions
);

export default submissions;