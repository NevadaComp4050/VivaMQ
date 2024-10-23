import { Router } from 'express';
import RubricController from './rubric.controller';
import { CreateRubricDto, LinkRubricToAssignmentDto } from '@/dto/rubric.dto';
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
 * POST /rubrics/link-to-assignment
 * @summary Link a rubric to an assignment
 * @tags Rubric
 */
rubrics.post(
  '/link-to-assignment',
  verifyAuthToken,
  RequestValidator.validate(LinkRubricToAssignmentDto),
  controller.linkRubricToAssignment
);

/**
 * DELETE /rubrics/{id}
 * @summary Delete a rubric
 * @tags Rubric
 */
rubrics.delete('/:id', verifyAuthToken, controller.deleteRubric);

export default rubrics;
