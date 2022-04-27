import { Request, Response, NextFunction } from 'express';
import TeamsService from '../services/teamsService';

export default class TeamsController {
  constructor(private teamsService: TeamsService) {}

  public async getTeams(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const teams = await this.teamsService.getTeams();

      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }

  public async getTeamById(req: Request, res: Response, next: NextFunction)
    : Promise<Response | void> {
    try {
      const { id } = req.params;
      // console.log('id params: ', typeof id);
      const teamById = await this.teamsService.getTeamById(id);

      return res.status(200).json(teamById);
    } catch (error) {
      next(error);
    }
  }
}
