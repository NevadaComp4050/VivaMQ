import { Router } from 'express';
import RubricController from './rubric.controller';
import { CreateRubricDto, UpdateRubricDto } from '@/dto/rubric.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const rubrics: Router = Router();
const controller = new RubricController();

/**
 * POST /rubrics
 * @summary Create a new rubric
 * @tags Rubric
 */
rubrics.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(CreateRubricDto),
  controller.createRubric
);

/**
 * GET /rubrics
 * @summary Get all rubrics with pagination
 * @tags Rubric
 */
rubrics.get('/', verifyAuthToken, controller.getRubrics);

/**
 * GET /rubrics/{id}
 * @summary Get a rubric by ID
 * @tags Rubric
 */
rubrics.get('/:id', verifyAuthToken, controller.getRubricById);

/**
 * PUT /rubrics/{id}
 * @summary Update a rubric
 * @tags Rubric
 */
rubrics.put(
  '/:id',
  verifyAuthToken,
  RequestValidator.validate(UpdateRubricDto),
  controller.updateRubric
);

/**
 * DELETE /rubrics/{id}
 * @summary Delete a rubric
 * @tags Rubric
 */
rubrics.delete('/:id', verifyAuthToken, controller.deleteRubric);


rubrics.get('/:id/export/xls', verifyAuthToken, controller.exportRubricXLS);

rubrics.get('/:id/export/pdf', verifyAuthToken, controller.exportRubricPDF);

export default rubrics;
