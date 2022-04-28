import { Router } from 'express';

import MatchesController from '../database/controllers/matchesController';
import MatchesService from '../database/services/matchesService';

const router = Router();

const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

router.get('/', (req, res, next) => matchesController.getAllMatches(req, res, next));

export default router;
