import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface DecodedToken {
  id: string;
  role: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route.' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_access_key_12345'
    ) as DecodedToken;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found.' });
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token verification failed. Not authorized.' });
  }
};
