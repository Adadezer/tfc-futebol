import { Router } from 'express';
import TeamsController from '../database/controllers/teamsController';
import TeamsService from '../database/services/teamsService';

// import validationLogin from '../middlewares/loginMiddleware';
// import authUser from '../middlewares/authUser';

const router = Router();

const teamsService = new TeamsService();
const teamsController = new TeamsController(teamsService);

router.get('/', (req, res, next) => teamsController.getTeams(req, res, next));

export default router;
