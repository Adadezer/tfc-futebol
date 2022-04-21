import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';

class Matche extends Model {
  public id!: number; // exclamação pra dizer q o atributo é obrigatório

  public homeTeam!: number;

  public homeTeamGoals!: number;

  public awayTeam!: number;

  public awayTeamGoals!: number;

  public inProgress!:boolean;
}

Matche.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  home_team: {
    type: INTEGER,
  },
  home_team_goals: {
    type: INTEGER,
  },
  away_team: {
    type: INTEGER,
  },
  away_team_goals: {
    type: INTEGER,
  },
  in_progress: {
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Matche',
  tableName: 'matches',
});

export default Matche;
