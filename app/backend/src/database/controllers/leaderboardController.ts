import { Request, Response, NextFunction } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  public async getLeaderboard(req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const leaderboard = await this.leaderboardService.getHomeLeaderboard();

      return res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
