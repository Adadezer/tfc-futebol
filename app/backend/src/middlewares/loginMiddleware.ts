import { Request, Response, NextFunction } from 'express';

export default function validationLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'email is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'password is required' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'email and password must be a string' });
  }

  if (!email.includes('@') || !email.endsWith('.com')) {
    return res.status(400).json({ message: 'email is incorrect ' });
  }

  if (password.length <= 6) {
    return res.status(400).json({ message: 'password must be longer than 6 characters' });
  }
  next();
}
