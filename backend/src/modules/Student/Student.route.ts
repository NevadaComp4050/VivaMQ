import { Router } from 'express';
import Controller from './Student.controller';
import { CreateStudentDto } from '@/dto/student.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const students: Router = Router();
const controller = new Controller();

/**
 * Create student body
 * @typedef {object} CreateStudentBody
 * @property {string} name.required - name of student
 * @property {string} email.required - student email
 */
/**
 * Student
 * @typedef {object} Student
 * @property {string} id - unique ID
 * @property {string} name - name of student
 * @property {string} email - student email
 */

/**
 * POST /students/create
 * @summary Create student
 * @tags Student
 * @param {CreateStudentBody} request.body.required
 * @return {Student} 201 - student created
 */
students.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateStudentDto),
  controller.createStudent
);

/**
 * GET /students/getall
 * @summary Get all student data
 * @tags Student
 * @param None
 * @return {Array.<Student>} 200 - student list
 */
students.get(
  '/getall',
  verifyAuthToken,
  controller.getallstudents
);

/**
 * GET /students/deleteall
 * @summary Delete all student data
 * @tags Student
 * @param None
 * @return {number} 200 - student clear
 */
students.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteallstudents
);

export default students;