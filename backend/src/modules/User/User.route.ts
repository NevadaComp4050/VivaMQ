import { Router } from 'express';
import UserController from './User.controller';
import { verifyAuthToken } from '@/middlewares/auth';
import { CreateUserDto, LoginUserDto } from '@/dto/user.dto';
import RequestValidator from '@/middlewares/request-validator';

const users: Router = Router();
const controller = new UserController();

/**
 * @typedef {object} CreateUserBody
 * @property {string} email.required - Email of the user
 * @property {string} password.required - Password of the user
 * @property {string} name.required - Name of the user
 */

/**
 * @typedef {object} LoginUserBody
 * @property {string} email.required - Email of the user
 * @property {string} password.required - Password of the user
 */

/**
 * @typedef {object} User
 * @property {string} id - Unique ID of the user
 * @property {string} email - Email of the user
 * @property {string} name - Name of the user
 * @property {string} createdAt - User creation date
 */

/**
 * POST /users/register
 * @summary Register a new user
 * @tags User
 * @param {CreateUserBody} request.body.required - The user registration payload
 * @return {User} 201 - The created user
 * @return {object} 400 - Bad request (validation errors)
 */
users.post(
  '/register',
  RequestValidator.validate(CreateUserDto), // Validate the request payload
  controller.register
);

/**
 * POST /users/login
 * @summary Login a user and issue a JWT token
 * @tags User
 * @param {LoginUserBody} request.body.required - The login payload
 * @return {object} 200 - JWT token for the authenticated user
 * @return {object} 401 - Unauthorized (invalid credentials)
 */
users.post(
  '/login',
  controller.login
);

/**
 * GET /users/me
 * @summary Get the current logged-in user
 * @tags User
 * @security BearerAuth
 * @return {User} 200 - The current user
 * @return {object} 401 - Unauthorized (invalid or missing token)
 */
users.get('/me', verifyAuthToken, controller.getCurrentUser);

export default users;

