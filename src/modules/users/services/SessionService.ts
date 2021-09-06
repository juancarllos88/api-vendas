import { createToken } from '@shared/util/auth';
import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../typeorm/repositories/UserRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  email: string;
  token: string;
}
export default class SessionService {
  public async createToken({ email, password }: IRequest): Promise<IResponse> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password.', 401);
    }
    const passwordConfirmed = await compare(password, user.password);
    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password.', 401);
    }

    const token = createToken(user);
    return {
      email: user.email,
      token: token,
    };
  }
}
