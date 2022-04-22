import { Router } from 'express';
import LoginController from '../database/controllers/userController';

import validationLogin from '../middlewares/loginMiddleware';

const router = Router();

const loginController = new LoginController();

router.post(
  '/login',
  validationLogin,
  async (req, res, next) => loginController.getLogin(req, res, next),
);

export default router;
