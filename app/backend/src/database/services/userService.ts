import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import ILogin from '../../interfaces/ILogin';
import UserModel from '../models/users';

const jwtSecret = fs.readFileSync('jwt.evaluation.key', 'utf-8');

export default class UserService {
  constructor(private userModel = UserModel) {}

  public async getUser(user: string) {
    const userValid = await this.userModel.findOne({ where: { email: user } });
    // console.log('users service:', userValid);
    if (userValid) {
      const { role } = userValid;
      return role;
    }
  }

  public async getLogin(login: ILogin) {
    const resultModel = await this.userModel.findOne({ where: { email: login.email } });
    // console.log('result Service: ', result);

    if (!resultModel) return null;

    const validUserPassword = await bcryptjs.compare(login.password, resultModel.password);

    if (!validUserPassword) return null;

    if (resultModel) {
      const { id, username, role, email } = resultModel;
      const result = { id, username, role, email };

      const payload = { data: login.email };
      const jwtConfig: jwt.SignOptions = { expiresIn: '60d', algorithm: 'HS256' };
      const token = jwt.sign(payload, jwtSecret, jwtConfig);

      return {
        user: result,
        token,
      };
    }
  }
}