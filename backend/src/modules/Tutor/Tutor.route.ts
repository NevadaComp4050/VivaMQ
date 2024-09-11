import { Router } from 'express';
import Controller from './Tutor.controller';
import { CreateTutorDto } from '@/dto/tutor.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const tutors: Router = Router();
const controller = new Controller();

/**
 * Create tutor body
 * @typedef {object} CreateTutorBody
 * @property {string} name.required - name of tutor
 * @property {string} email.required - tutor email
 * @property {string} unitId.required - ID of unit of tutor
 */
/**
 * Tutor
 * @typedef {object} Tutor
 * @property {string} id - unique ID
 * @property {string} name - name of tutor
 * @property {string} email - tutor email
 * @property {string} unitId - ID of unit of tutor
 * @property {unit} unit - unit of tutor
 */

/**
 * POST /tutors/create
 * @summary Create tutor
 * @tags Tutor
 * @param {CreateTutorBody} request.body.required
 * @return {Tutor} 201 - tutor created
 */
tutors.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateTutorDto),
  controller.create
);

/**
 * GET /tutors/{id}
 * @summary Get a single tutor
 * @tags Tutor
 * @param {string} id.path.required
 * @return {Tutor} 200 - tutor list
 */
tutors.get(
  '/:id',
  verifyAuthToken,
  controller.get
);

/**
 * GET /tutors/
 * @summary Get all tutor data
 * @tags Tutor
 * @param None
 * @return {Array.<Tutor>} 200 - tutor list
 */
tutors.get(
  '/',
  verifyAuthToken,
  controller.getAll
);

/**
 * DELETE /tutors/{id}
 * @summary Delete a single tutor
 * @tags Tutor
 * @param {string} id.path.required - ID of the tutor to delete
 * @return {Tutor} 200 - tutor list
 */
tutors.delete(
  '/:id',
  verifyAuthToken,
  controller.delete
);

/**
 * DELETE /tutors/
 * @summary Delete all tutor data
 * @tags Tutor
 * @param None
 * @return {number} 200 - tutor clear
 */
tutors.delete(
  '/',
  verifyAuthToken,
  controller.deleteAll
);

export default tutors;