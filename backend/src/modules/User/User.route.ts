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
 * @property {string} cognitoId.required - cognito id
 * @property {string} phone - phone number
 */
/**
 * User
 * @typedef {object} User
 * @property {string} id
 * @property {DateTime} createdAt
 * @property {string} email - email of user
 * @property {string} name - name of user
 * @property {string} phone - phone number
 * @property {string} password - ???
 * @property {role} role
 * @property {unit[]} units
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
  //RequestValidator.validate(CreateUserDto),
  controller.createUser
);

/**
 * GET /users/getall
 * @summary Get all user data
 * @tags User
 * @param None
 * @return {Array.<User>} 200 - user list
 */
users.get(
  '/getall',
  verifyAuthToken,
  controller.getallusers
);

export default users;
