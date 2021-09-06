import StatusCode from '@shared/util/StatusCode';
import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const userService = new UserService();
    const user = await userService.save({ name, email, password });
    const userTO = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    };
    return response.json(userTO);
  }

  public async findAll(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userService = new UserService();
    const user = await userService.findAll();
    const listUser = user.map(element => {
      return {
        id: element.id,
        email: element.email,
        name: element.name,
      };
    });
    return response.json(listUser);
  }

  public async updateAvatar(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const userService = new UserService();
    const user = await userService.updateAvatar({
      id: id,
      avatarFileName: request.file?.filename,
    });
    return response.json(user);
  }

  public async forgotPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email } = request.body;
    const userService = new UserService();
    await userService.forgotPassword(email);

    return response.status(StatusCode.NO_CONTENT).json();
  }

  public async resetPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { token, password } = request.body;
    const userService = new UserService();
    await userService.resetPassword({ token, password });

    return response.status(StatusCode.NO_CONTENT).json();
  }
}
