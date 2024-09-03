import { Router } from 'express';
import Controller from './User.controller';
import { CreateUserDto } from '@/dto/user.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';


const users: Router = Router();
const controller = new Controller();


// Define CreateUserBody
// Comments after property do render
/**
 * Create user body
 * @typedef {object} CreateUserBody
 * @property {string} email.required - email of user
 * @property {string} name.required - name of user
 * @property {string} phone - phone number
 * @property {string} password.required - password
 */

/**
 * Create idField
 * @typedef {object} idField
 * @property {string} id.required

 */
/**
 * User
 * @typedef {object} User
 * @property {string} id - Unique ID
 * @property {DateTime} createdAt - date of registration
 * @property {string} email - email of user
 * @property {string} name - name of user
 * @property {string} phone - phone number
 * @property {string} password - 
 * @property {Role} role - Users role, default Student
 */

// Use CreateUserBody
/**
 * POST /users/create
 * @summary Create user
 * @tags User
 * @param {CreateUserBody} request.body.required
 * @return {User} 201 - user created

 */
users.post(
  '/create',
  verifyAuthToken,
  RequestValidator.validate(CreateUserDto),
  controller.createUser
);

/**
 * GET /users/getall
 * @summary Get all user data
 * @tags User
 * @param None
 * @return {User} 200 - user list
 */
users.get(
  '/getall',
  verifyAuthToken,
  controller.getAll
);

/**
 * GET /users/{id}
 * @summary Get a single user data
 * @tags User
 * @param {string} id.path.required
 * @return {User} 200 - user list
 */
users.get(
  '/:id',
  verifyAuthToken,
  controller.get
);

/**
 * POST /users/{id}
 * @summary Delete a single user data
 * @tags User
 * @param {string} id.path.required
 * @return {User} 200 - user list
 */
users.post(
  '/:id',
  verifyAuthToken,
  controller.delete
);

/**
 * GET /users/deleteall
 * @summary Delete all user data
 * @tags User
 * @param None
 * @return {number} 200 - user clear
 */
users.get(
  '/deleteall',
  verifyAuthToken,
  controller.deleteAll
);

// TODO this needs to be modified
export default users;
