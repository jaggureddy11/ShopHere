import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle duplicate key errors in MongoDB
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered.';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${(err as any).value}`;
  }

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
