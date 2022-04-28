import { validateToken } from '@shared/util/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import StatusCode from '@shared/util/StatusCode';

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
  const { sub, exp } = validateToken(token);

  if (Date.now() >= exp * 1000) {
    throw new AppError('Token expired.', StatusCode.UNAUTHORIZED);
  }

  request.user = {
    id: sub,
  };
  return next();
};

export default isAuthenticated;
