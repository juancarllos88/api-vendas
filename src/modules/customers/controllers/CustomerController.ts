import StatusCode from '@shared/util/StatusCode';
import { Request, Response } from 'express';
import CustomerService from '../services/CustomerService';

export default class CustomerController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const customerService = new CustomerService();
    const customer = await customerService.save(name, email);
    return response.status(StatusCode.CREATED).json(customer);
  }

  public async findAll(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const customerService = new CustomerService();
    const users = await customerService.findAll();
    return response.json(users);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const customerService = new CustomerService();
    await customerService.delete(Number(id));
    return response.status(StatusCode.NO_CONTENT).json();
  }

  public async find(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const customerService = new CustomerService();
    const customer = await customerService.find(Number(id));
    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email } = request.body;
    const customerService = new CustomerService();
    const customer = await customerService.update(Number(id), name, email);
    return response.status(StatusCode.CREATED).json(customer);
  }
}
