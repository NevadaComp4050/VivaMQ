import { Router } from 'express';

const misc: Router = Router();

/**
 * Register user body
 * @typedef {object} RegisterBody
 * @property {string} email.required - email of user
 * @property {string} name.required - name of user
 * @property {string} phone - phone number
 * @property {string} password.required - password
 */

/**
 * Login user body
 * @typedef {object} LoginBody
 * @property {string} email.required - email of user
 * @property {string} password.required - password
 */


/**
 * Misc
 * @typedef {object} Misc
 * @property {string} fuckingWork - work
 */


/**
 * POST /misc/login
 * @summary Login a user
 * @tags Misc
 * @property {string} email.required - email of user
 * @property {string} password.required - password
 * @param {LoginBody} request.body.required
 * @return {number} 200 - user list
 */
/*
misc.post('/login',
    controller.getreq,
    generateAuthToken,
);*/

/**
 * POST /misc/register
 * @summary Create new user and log them in
 * @tags Misc
 * @property {string} email.required - email of user
 * @property {string} name.required - name of user
 * @property {string} phone - phone number
 * @property {string} password.required - password
* @param {RegisterBody} request.body.required
 * @return {number} 200 - user list
 */
/*
misc.post('/register',
    controller.createreq,
    generateAuthToken
);*/



export default misc;