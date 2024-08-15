import { Router } from 'express';
import QuestionController from './questions.controller';
import { UpdateQuestionDto, CreateQuestionDto } from '@/dto/question.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const questions: Router = Router();
const controller = new QuestionController();

/**
 * Generate questions body
 * @typedef {object} GenerateQuestionsBody
 * @property {string} fileId.required - ID of the file
 */
/**
 * Question
 * @typedef {object} Question
 * @property {string} question - Question text
 * @property {boolean} locked - If the question is locked
 * @property {boolean} asked - If the question has been asked
 */

/**
 * POST /questions/generate/:fileId
 * Generate questions
 * @tags questions
 * @param {GenerateQuestionsBody} request.body.required
 * @return {Array.<Question>} 201 - Questions generated
 */
questions.post(
  '/generate/:fileId',
  verifyAuthToken,
  RequestValidator.validate(CreateQuestionDto),
  controller.generateQuestions
);

/**
 * PUT /questions/update/:id
 * Update a question
 * @tags questions
 * @param {Question} request.body.required
 * @return {Question} 200 - Question updated
 * @return {string} 404 - Question not found
 * @return {string} 400 - Invalid request
 * @return {string} 500 - Internal server error
 * @return {string} 401 - Unauthorized
 */
questions.put(
  '/update/:id',
  verifyAuthToken,
  RequestValidator.validate(UpdateQuestionDto),
  controller.updateQuestion
);
