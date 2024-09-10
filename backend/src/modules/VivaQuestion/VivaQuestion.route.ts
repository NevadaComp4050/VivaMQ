import { Router } from 'express';
import Controller from './VivaQuestion.controller';
import { CreateVivaQuestionDto } from '@/dto/vivaQuestion.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
//import { Submission, VivaQuestion } from '@prisma/client';


const vivaQuestions: Router = Router();
const controller = new Controller();


// Define CreateVivaQuestionBody
// Comments after property do render
/**
 * CreateVivaQuestion
 * @typedef {object} CreateVivaQuestion
 * @property {string} submissionId.required - submissionId
 * @property {string} question.required - question text
 */
/**
 * VivaQuestion
 * @typedef {object} VivaQuestion
 * @property {string} id - Unique ID
 * @property {string} submissionId - submissionId
 * @property {string} question - question text
 * @property {string} status - status
 * @property {Submission} submission - @relation(fields: [submissionId], references: [id])
 */


/**
 * POST /vivaQuestions/create
 * @summary Create vivaQuestion
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

// TODO this needs to be modified
export default vivaQuestions;
