import { Router } from 'express';
import Controller from './User.controller';
import { CreateUserDto } from '@/dto/user.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const users: Router = Router();
const controller = new Controller();

/**
 * @typedef {object} CreateUserBody
 * @property {string} email.required - Email of the user
 * @property {string} name.required - Name of the user
 * @property {string} phone - Phone number of the user
 * @property {string} password.required - Password of the user
 */

/**
 * @typedef {object} User
 * @property {string} id - Unique ID of the user
 * @property {Date} createdAt - User creation date
 * @property {string} email - Email of the user
 * @property {string} name - Name of the user
 * @property {string} phone - Phone number of the user
 * @property {string} password - Hashed password of the user
 * @property {Role} role - Role of the user, default is STUDENT
 */

/**
 * @typedef {object} Role
 * @property {string} ADMIN - Role for admin users
 * @property {string} TEACHER - Role for teacher users
 * @property {string} STUDENT - Role for student users
 */

/**
 * @route POST /users
 * @summary Create a new user
 * @tags User
 * @param {CreateUserBody} request.body.required - The user creation payload
 * @return {User} 201 - The created user
 */
users.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(CreateUserDto),
  controller.createUser
);

/**
 * @route GET /users
 * @summary Get all users
 * @tags User
 * @return {Array.<User>} 200 - A list of users
 */
users.get(
  '/',
  verifyAuthToken,
  controller.getAll
);

/**
 * @route GET /users/{id}
 * @summary Get a user by ID
 * @tags User
 * @param {string} id.path.required - The ID of the user to retrieve
 * @return {User} 200 - The retrieved user
 */
users.get(
  '/:id',
  verifyAuthToken,
  controller.get
);

/**
 * @route DELETE /users/{id}
 * @summary Delete a user by ID
 * @tags User
 * @param {string} id.path.required - The ID of the user to delete
 * @return {User} 200 - The deleted user
 */
users.delete(
  '/:id',
  verifyAuthToken,
  controller.delete
);

/**
 * @route POST /users/login
 * @summary Dummy login to create or return the test user
 * @tags User
 * @return {User} 200 - The test user
 */
users.post('/login', controller.dummyLogin);

/**
 * @route GET /users/me
 * @summary Get the current logged-in user
 * @tags User
 * @return {User} 200 - The current user
 */
users.get('/me', controller.getCurrentUser);

export default users;
