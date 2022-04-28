import { Request, Response, NextFunction } from 'express';
import MatchesService from '../services/matchesService';

export default class MatchesController {
  constructor(private matchesService: MatchesService) {}

  public async getAllMatches(req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const { inProgress } = req.query;
      // console.log('progress Controller: ', inProgress);

      const matches = await this.matchesService.getAllMatches();

      if (inProgress) {
        const progressBoolean = inProgress === 'true'; // vai retornar o booleano true, ou o booleano false caso a string nao seja 'true';
        const progress = matches.filter((el) => el.inProgress === progressBoolean);
        return res.status(200).json(progress);
      }
      return res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  }
}