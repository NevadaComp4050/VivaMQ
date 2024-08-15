import { Router } from 'express';
import TutorController from './tutors.controller';
import { CreateTutorDto } from '@/dto/tutor.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const tutors: Router = Router();
const controller = new TutorController();

/**
 * Create tutor body
 * @typedef {object} CreateTutorBody
 * @property {string} name.required - Name of the tutor
 * @property {string} email.required - Email of the tutor
 */
/**
 * Tutor
 * @typedef {object} Tutor
 * @property {string} name - Name of the tutor
 * @property {string} email - Email of the tutor
 */

/**
 * POST /tutors/create
 * Create a new tutor
 * @tags tutors
 * @param {CreateTutorBody} request.body.required
 * @return {Tutor} 201 - Tutor created
 */
tutors.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateTutorDto),
  controller.createTutor
);

/**
 * GET /tutors/getall
 * Get all tutors
 * @tags tutors
 * @return {Array.<Tutor>} 200 - List of tutors
 */
tutors.get('/getall', verifyAuthToken, controller.getAllTutors);

export default tutors;
