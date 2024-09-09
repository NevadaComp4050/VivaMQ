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
  controller.createTutor
);

/**
 * GET /tutors/getall
 * @summary Get all tutor data
 * @tags Tutor
 * @param None
 * @return {Array.<Tutor>} 200 - tutor list
 */
tutors.get(
  '/getall',
  verifyAuthToken,
  controller.getalltutors
);

/**
 * GET /tutors/deleteall
 * @summary Delete all tutor data
 * @tags Tutor
 * @param None
 * @return {number} 200 - tutor clear
 */
tutors.get(
  '/deleteall',
  verifyAuthToken,
  controller.deletealltutors
);

export default tutors;