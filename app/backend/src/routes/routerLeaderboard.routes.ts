import { Router } from 'express';

import LeaderboardController from '../database/controllers/leaderboardController';
import LeaderboardService from '../database/services/leaderboardService';
// import MatchesService from '../database/services/matchesService';
// import TeamsService from '../database/services/teamsService';

const router = Router();

// const matchesService = new MatchesService();
// const teamsService = new TeamsService();

const leaderboardService = new LeaderboardService();
const leaderboardController = new LeaderboardController(leaderboardService);

router.get('/home', (req, res, next) => leaderboardController.getLeaderboard(req, res, next));

export default router;
