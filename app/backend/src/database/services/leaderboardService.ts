import MatchesService from './matchesService';
import TeamsService from './teamsService';
import ILeaderboard from '../../interfaces/ILeaderboard';

export default class LeaderboardService {
  public matchesService = new MatchesService();

  public teamService = new TeamsService();

  public async blankLeaderboard() {
    const allTeam = await this.teamService.getTeams();

    const boardInitial = allTeam.map((team) => ({
      name: team.teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }));
    return boardInitial;
  }

  public async finishedMatches() {
    const allMatches = await this.matchesService.getAllMatches();
    const finishedMatches = allMatches.filter((el) => el.inProgress === false);
    return finishedMatches;
  }

  public async teamHomeWinner(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const gameResults = leaderboard.find((winner) => match.teamHome.teamName === winner.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.homeTeamGoals;
        gameResults.goalsOwn += match.awayTeamGoals;
        gameResults.totalPoints += 3;
        gameResults.totalGames += 1;
        gameResults.totalVictories += 1;
      }
    });
  }

  public async teamHomeLoser(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const gameResults = leaderboard.find((loser) => match.teamHome.teamName === loser.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.homeTeamGoals;
        gameResults.goalsOwn += match.awayTeamGoals;
        gameResults.totalGames += 1;
        gameResults.totalLosses += 1;
      }
    });
  }

  public async teamHomeDraw(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const gameResults = leaderboard.find((draw) => match.teamHome.teamName === draw.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.homeTeamGoals;
        gameResults.goalsOwn += match.awayTeamGoals;
        gameResults.totalPoints += 1;
        gameResults.totalGames += 1;
        gameResults.totalDraws += 1;
      }
    });
  }

  public async goalsBalance(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      const teamData = leaderboard.find((team) => match.teamHome.teamName === team.name);
      if (!teamData) return null;
      teamData.goalsBalance = (teamData.goalsFavor - teamData.goalsOwn);
    });
  }

  public async efficiency(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      const teamData = leaderboard.find((team) => match.teamHome.teamName === team.name);
      if (!teamData) return null;
      const percentageUse = (teamData.totalPoints / (teamData.totalGames * 3)) * 100;
      teamData.efficiency = Number(percentageUse.toFixed(2));
    });
  }

  static sortLeaderboard(leaderboard: ILeaderboard[]) {
    // static para lidar com a falta do this
    (leaderboard).sort((a, b) => b.totalPoints - a.totalPoints).sort((a, b) => {
      if (a.totalPoints === b.totalPoints) { return b.totalVictories - a.totalVictories; } return 0;
    }).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)) {
        return b.goalsBalance - a.goalsBalance;
      } return 0;
    }).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance)) {
        return b.goalsFavor - a.goalsFavor;
      } return 0;
    })
      .sort((a, b) => {
        if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance) && (a.goalsFavor === b.goalsFavor)) {
          return b.goalsOwn - a.goalsOwn;
        } return 0;
      });
  }

  public async getHomeLeaderboard() {
    const board = await this.blankLeaderboard();
    await Promise.all([
      this.teamHomeWinner(board),
      this.teamHomeLoser(board),
      this.teamHomeDraw(board),
    ]);
    await this.goalsBalance(board);
    await this.efficiency(board);
    LeaderboardService.sortLeaderboard(board);
    return board;
  }
}
