import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UserRepository from '../typeorm/repositories/UserRepository';
import uploadConfig from '@config/upload';
import UserTokenService from '@modules/users/services/UserTokenService';
import UserTokenRepository from '@modules/users/typeorm/repositories/UserTokenRepository';
import { isAfter, addHours } from 'date-fns';
import StatusCode from '@shared/util/StatusCode';
import EtherealMail from '@config/mail/EtherealMail';

interface IResetPassword {
  token: string;
  password: string;
}

interface ICreateRequest {
  name: string;
  email: string;
  password: string;
}

interface IRequest {
  id: string;
  avatarFileName?: string;
}

export default class UserService {
  public async save({ name, email, password }: ICreateRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new AppError('Email address already used.');
    }
    const hashedPassword = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);
    return user;
  }

  public async findAll(): Promise<User[]> {
    const userRepository = getCustomRepository(UserRepository);
    const users = userRepository.find();
    return users;
  }

  public async updateAvatar({
    id,
    avatarFileName,
  }: IRequest): Promise<IRequest> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne(id);
    if (!user) {
      throw new AppError('User not found.');
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const fileExists = await fs.promises.stat(userAvatarFilePath);
      if (fileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    if (avatarFileName) {
      user.avatar = avatarFileName;
      userRepository.save(user);
    }
    return {
      id: user.id,
      avatarFileName: user.avatar,
    };
  }

  public async forgotPassword(email: string): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.', StatusCode.NOT_FOUD);
    }

    const userTokenService = new UserTokenService();
    const { token } = await userTokenService.save(user.id);
    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        template: `Olá {{name}}. Solicitação de redifinição de senha recebida: {{token}}`,
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }

  public async resetPassword({
    token,
    password,
  }: IResetPassword): Promise<void> {
    const userTokenRepositoy = getCustomRepository(UserTokenRepository);
    const userToken = await userTokenRepositoy.findByToken(token);
    if (!userToken) {
      throw new AppError('User Token does not exists.', StatusCode.NOT_FOUD);
    }

    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists.', StatusCode.NOT_FOUD);
    }

    const compareDate = addHours(userToken.created_at, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await hash(password, 8);
    await userRepository.save(user);
  }
}
