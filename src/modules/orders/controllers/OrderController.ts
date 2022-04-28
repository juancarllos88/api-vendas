import { Request, Response } from 'express';

export default class OrderController {
  async find(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    return response.json();
  }
}
