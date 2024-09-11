import { Router } from 'express';
import Controller from './VivaQuestion.controller';
import { CreateVivaQuestionDto } from '@/dto/vivaQuestion.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const vivaQuestions: Router = Router();
const controller = new Controller();

// Define CreateVivaQuestionBody
// Comments after property do render
/**
 * Create viva question
 * @typedef {object} CreateVivaQuestion
 * @property {string} submissionId.required - ID of submission of viva question
 * @property {string} question.required - viva question text
 * @property {string} status.required - status of viva question
 */
/**
 * VivaQuestion
 * @typedef {object} VivaQuestion
 * @property {string} id - unique ID
 * @property {string} submissionId - ID of submission of viva question
 * @property {string} question - viva question text
 * @property {string} status - status of viva question
 * @property {submission} submission - submission of viva question
 */

/**
 * POST /vivaQuestions/create
 * @summary Create viva question
 * @tags VivaQuestion
 * @param {CreateVivaQuestion} request.body.required
 * @return {VivaQuestion} 201 - vivaQuestion created
 */
vivaQuestions.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateVivaQuestionDto),
  controller.createVivaQuestion
);

/**
 * GET /vivaQuestions/
 * @summary Get all vivaQuestion data
 * @tags VivaQuestion
 * @param None
 * @return {Array.<VivaQuestion>} 200 - vivaQuestion list
 */
vivaQuestions.get(
  '/',
  verifyAuthToken,
  controller.getAll
);

/**
 * DELETE /vivaQuestions/
 * @summary Delete all vivaQuestion data
 * @tags VivaQuestion
 * @param None
 * @return {number} 200 - vivaQuestion clear
 */
vivaQuestions.delete(
  '/',
  verifyAuthToken,
  controller.deleteAll
);

export default vivaQuestions;
