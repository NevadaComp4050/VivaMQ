import { Router } from 'express';
import StudentController from './students.controller';
import { CreateStudentDto } from '@/dto/student.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const students: Router = Router();
const controller = new StudentController();

/**
 * Create student body
 * @typedef {object} CreateStudentBody
 * @property {string} name.required - Name of the student
 * @property {string} email.required - Email of the student
 * @property {string} studentId.required - Student ID
 * @property {string} groupId.required - Group ID
 */
/**
 * Student
 * @typedef {object} Student
 * @property {string} name - Name of the student
 * @property {string} email - Email of the student
 * @property {string} studentId - Student ID
 * @property {string} groupId - Group ID
 */

/**
 * POST /students/create
 * Create a new student
 * @tags students
 * @param {CreateStudentBody} request.body.required
 * @return {Student} 201 - Student created
 */
students.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateStudentDto),
  controller.createStudent
);

/**
 * GET /students/getall
 * Get all students
 * @tags students
 * @return {Array.<Student>} 200 - List of students
 */
students.get(
  '/getall',
  verifyAuthToken,
  controller.getAllStudents
);

export default students;