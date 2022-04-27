import TeamModel from '../models/teams';
import ITeams from '../../interfaces/ITeams';

export default class TeamsService {
  constructor(private teamsModel = TeamModel) {}

  public async getTeams(): Promise<ITeams[]> {
    const teams = await this.teamsModel.findAll();
    // console.log('teams Service', teams);
    return teams;
  }

  public async getTeamById(id: string) {
    const team = await this.teamsModel.findOne({ where: { id } });
    // console.log('teamService: ', team);
    return team;
  }
}
