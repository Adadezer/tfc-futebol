import MatchesModel from '../models/matches';
import TeamModel from '../models/teams';

export default class MatchesService {
  constructor(private matchesMoldel = MatchesModel) {}

  public async getAllMatches() {
    const matches = await this.matchesMoldel.findAll({
      include: [
        /*  dentro da tabela matches, vou procurar o model de Team, onde ele é chamado de 'teamHome', buscar o conteudo da coluna 'teamName', e incluir esse resultado no resuldado trago pelo findAll (https://tableless.com.br/sequelize-a-solu%C3%A7%C3%A3o-para-seus-relacionamentos/) */
        { model: TeamModel, as: 'teamHome', attributes: ['teamName'] },
        { model: TeamModel, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    return matches;
  }
}
