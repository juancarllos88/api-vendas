import { Request, Response } from 'express';
import SessionService from '../services/SessionService';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const sessionService = new SessionService();
    const token = await sessionService.createToken({ email, password });
    return response.json(token);
  }
}
