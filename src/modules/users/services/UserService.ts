import AppError from '@shared/errors/AppError';
import { hash, compare } from 'bcryptjs';
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

interface IUpdateRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
}

interface IRequest {
  id: string;
  avatarFileName?: string;
}

interface IPaginateUser {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: User[];
}

const validateUser = (user: User | undefined): void => {
  if (!user) {
    throw new AppError('User not found.', StatusCode.NOT_FOUD);
  }
};

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

  public async update({
    id,
    name,
    email,
    password,
    old_password,
  }: IUpdateRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', StatusCode.NOT_FOUD);
    }

    const userUpdateEmail = await userRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== id) {
      throw new AppError(
        'There is already one user with this email.',
        StatusCode.BAD_REQUEST,
      );
    }

    if (password && !old_password) {
      throw new AppError('Old password is required.', StatusCode.BAD_REQUEST);
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError(
          'Old password does not match.',
          StatusCode.BAD_REQUEST,
        );
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await userRepository.save(user);

    return user;
  }

  public async findAll(): Promise<IPaginateUser> {
    const userRepository = getCustomRepository(UserRepository);
    //const users = await userRepository.find();
    const users = await userRepository.createQueryBuilder().paginate();
    return users as IPaginateUser;
  }

  public async find(id: string): Promise<User | undefined> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findById(id);
    validateUser(user);
    return user;
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

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'templates',
      'forgot_password.hbs',
    );

    const userTokenService = new UserTokenService();
    const { token } = await userTokenService.save(user.id);
    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        //template: `Olá {{name}}. Solicitação de redifinição de senha recebida: {{token}}`,
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          //token,
          link: `http://localhost:3000/reset_password?token=${token}`,
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
