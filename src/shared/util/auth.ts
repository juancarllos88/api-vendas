import User from '@modules/users/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { sign, verify } from 'jsonwebtoken';

interface ITokenPayload {
  id: string;
  user: string;
  email: string;
  iat: number;
  exp: number;
  sub: string;
}
export const jwt = {
  jwt: {
    secret: 'api-vendas',
    expiresIn: '1d',
  },
};

export const createToken = (user: User): string => {
  const token = sign(
    { id: user.id, user: user.name, email: user.email },
    jwt.jwt.secret,
    {
      subject: user.id,
      expiresIn: jwt.jwt.expiresIn,
    },
  );
  return token;
};

export const validateToken = (token: string): ITokenPayload => {
  try {
    const decodedToken = verify(token, jwt.jwt.secret);
    return decodedToken as ITokenPayload;
  } catch (error) {
    throw new AppError('Invalid Token.');
  }
};
