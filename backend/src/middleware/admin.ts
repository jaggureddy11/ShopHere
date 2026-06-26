import { Request, Response, NextFunction } from 'express';

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.'
    });
  }
};
