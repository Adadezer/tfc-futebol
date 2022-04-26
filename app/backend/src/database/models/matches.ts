import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import Team from './teams';

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
  homeTeam: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  timestamps: false,
  sequelize: db,
  modelName: 'Matche',
  tableName: 'matches',
});

Team.hasMany(Matche, { foreignKey: 'homeTeam', as: 'Home_Team' });
Team.hasMany(Matche, { foreignKey: 'awayTeam', as: 'Away_Team' });
export default Matche;
