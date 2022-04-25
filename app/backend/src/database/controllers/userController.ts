import { NextFunction, Request, Response } from 'express';
import ILogin from '../../interfaces/ILogin';
import UserService from '../services/userService';

export default class UserController {
  constructor(private userService: UserService) {}

  async getLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const login: ILogin = { email, password };

      const user = await this.userService.getLogin(login);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
