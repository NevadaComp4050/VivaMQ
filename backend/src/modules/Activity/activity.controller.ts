import { type NextFunction } from 'express';
import { HttpStatusCode } from 'axios';
import ActivityService from './activity.service';
import { type CustomResponse } from '@/types/common.type';
import { type ExtendedRequest } from '@/types/express';
import Api from '@/lib/api';

export default class ActivityController extends Api {
  private readonly activityService = new ActivityService();

  // Get recent activities with pagination
  public getRecentActivities = async (
    req: ExtendedRequest,
    res: CustomResponse<any>,
    next: NextFunction
  ) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const userId = req.user?.id;
      if (!userId) {
        return this.unauthorizedResponse(res, 'User not authenticated');
      }

      const activities = await this.activityService.getRecentActivities(
        userId,
        limit,
        page
      );

      this.send(res, activities, HttpStatusCode.Ok, 'getRecentActivities');
    } catch (e) {
      next(e);
    }
  };

  private unauthorizedResponse(res: CustomResponse<any>, message: string) {
    return res.status(HttpStatusCode.Unauthorized).json({
      message,
      data: null,
    });
  }
}
