import { Router } from 'express';
import ActivityController from './activity.controller';
import { verifyAuthToken } from '@/middlewares/auth';

const activities: Router = Router();
const controller = new ActivityController();

/**
 * GET /activities
 * @summary Get recent activities with pagination
 * @tags Activities
 * @param {integer} limit.query - Limit
 * @param {integer} page.query - Page
 * @return {Array.<object>} 200 - List of recent activities
 */
activities.get('/', verifyAuthToken, controller.getRecentActivities);

export default activities;
