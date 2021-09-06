import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

export default class ProductController {
  public async findAll(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const service = new ProductService();
    const products = await service.findAll();
    return response.json(products);
  }

  public async find(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const service = new ProductService();
    const product = await service.find({ id });
    return response.json(product);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const service = new ProductService();
    const product = await service.save({ name, price, quantity });
    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, price, quantity } = request.body;
    const service = new ProductService();
    const product = await service.update({ id, name, price, quantity });
    return response.json(product);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const service = new ProductService();
    await service.delete({ id });
    return response.json([]);
  }
}
