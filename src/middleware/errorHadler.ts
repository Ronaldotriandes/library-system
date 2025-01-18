import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../lib/error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: false,
      message: err.message,
    });
  }
  return res.status(404).json({
    status: false,
    message: 'Not Found',
  });
  next(err);
};
