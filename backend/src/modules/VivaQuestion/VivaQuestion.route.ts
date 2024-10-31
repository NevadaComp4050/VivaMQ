import { Router } from 'express';
import VivaQuestionController from './VivaQuestion.controller';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import { CreateVivaQuestionDto } from '@/dto/vivaQuestion.dto';

const vivaQuestions: Router = Router();
const controller = new VivaQuestionController();

/**
 * POST /viva-questions/create
 * @summary Create a new viva question
 * @tags VivaQuestion
 * @param {CreateVivaQuestion} request.body.required
 * @return {VivaQuestion} 201 - Viva question created
 */
vivaQuestions.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateVivaQuestionDto),
  controller.create
);

/**
 * GET /viva-questions/{id}
 * @summary Get a single viva question
 * @tags VivaQuestion
 * @param {string} id.path.required - ID of the viva question to retrieve
 * @return {VivaQuestion} 200 - Viva question retrieved
 */
vivaQuestions.get('/:id', verifyAuthToken, controller.get);

/**
 * PATCH /viva-questions/{id}
 * @summary Update the text of a viva question
 * @tags VivaQuestion
 * @param {string} id.path.required - ID of the viva question to update
 * @param {string} request.body.required - New text for the viva question
 * @return {VivaQuestion} 200 - Viva question updated
 */
vivaQuestions.patch('/:id', verifyAuthToken, controller.update);

/**
 * GET /viva-questions/
 * @summary Get all viva questions
 * @tags VivaQuestion
 * @return {Array.<VivaQuestion>} 200 - Viva questions retrieved
 */
vivaQuestions.get('/', verifyAuthToken, controller.getAll);

/**
 * DELETE /viva-questions/{id}
 * @summary Delete a single viva question
 * @tags VivaQuestion
 * @param {string} id.path.required - ID of the viva question to delete
 * @return {VivaQuestion} 200 - Viva question deleted
 */
vivaQuestions.delete('/:id', verifyAuthToken, controller.delete);

/**
 * DELETE /viva-questions/
 * @summary Delete all viva questions
 * @tags VivaQuestion
 * @return {number} 200 - Count of deleted viva questions
 */
vivaQuestions.delete('/', verifyAuthToken, controller.deleteAll);

/**
 * POST /viva-questions/{id}/toggle-lock
 * @summary Toggle lock status of a viva question
 * @tags VivaQuestion
 * @param {string} id.path.required - ID of the viva question to toggle lock
 * @return {VivaQuestion} 200 - Lock status toggled
 */
vivaQuestions.post('/:id/toggle-lock', verifyAuthToken, controller.toggleLock);

/**
 * POST /viva-questions/{id}/regenerate
 * @summary Regenerate a viva question
 * @tags VivaQuestion
 * @param {string} id.path.required - ID of the viva question to regenerate
 * @return {VivaQuestion} 201 - Viva question regenerated
 */
vivaQuestions.post(
  '/:id/regenerate',
  verifyAuthToken,
  controller.regenerateVivaQuestion
);

vivaQuestions.patch('/:id/lock', verifyAuthToken, controller.lockVivaQuestion);

// PATCH endpoint to unlock a specific VivaQuestion
vivaQuestions.patch(
  '/:id/unlock',
  verifyAuthToken,
  controller.unlockVivaQuestion
);

export default vivaQuestions;
