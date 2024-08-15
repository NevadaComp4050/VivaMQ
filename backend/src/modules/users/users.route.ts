import { Router } from 'express';
import UserController from './users.controller';
import { CreateUserDto } from '@/dto/user.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const users: Router = Router();
const controller = new UserController();

/**
 * Create user body
 * @typedef {object} CreateUserBody
 * @property {string} email.required - email of the user
 * @property {string} name.required - name of the user
 * @property {string} password.required - password of the user
 */
/**
 * User
 * @typedef {object} User
 * @property {string} email - email of the user
 * @property {string} name - name of the user
 * @property {string} password - password of the user
 */

/**
 * POST /users/create
 * Create a new user
 * @tags users
 * @param {CreateUserBody} request.body.required
 * @return {User} 201 - User created
 */
users.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateUserDto),
  controller.createUser
);

/**
 * GET /users/getall
 * Get all users
 * @tags users
 * @return {Array.<User>} 200 - List of users
 */
users.get(
  '/getall',
  verifyAuthToken,
  controller.getAllUsers
);

export default users;