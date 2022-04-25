import { Router } from 'express';
import UserController from '../database/controllers/userController';
import UserService from '../database/services/userService';

import validationLogin from '../middlewares/loginMiddleware';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post(
  '/login',
  validationLogin,
  async (req, res, next) => userController.getLogin(req, res, next),
);

export default router;
