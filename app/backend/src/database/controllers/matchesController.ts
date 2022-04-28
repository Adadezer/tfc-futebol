import { Request, Response, NextFunction } from 'express';
import MatchesService from '../services/matchesService';

export default class MatchesController {
  constructor(private matchesService: MatchesService) {}

  public async getAllMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await this.matchesService.getAllMatches();

      return res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  }
}
