import { validateToken } from '@shared/util/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';

const isAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Token is missing');
  }
  const [, token] = authHeader.split(' ');
  const { sub } = validateToken(token);
  request.user = {
    id: sub,
  };
  return next();
};

export default isAuthenticated;
