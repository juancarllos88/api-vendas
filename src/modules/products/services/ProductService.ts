import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductRepository';

interface ICreateRequest {
  name: string;
  price: number;
  quantity: number;
}

interface IRequest {
  id: number;
}

interface IUpdateRequest {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default class ProductService {
  public async save({
    name,
    price,
    quantity,
  }: ICreateRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository);
    const productExists = await productRepository.findByName(name);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }
    const product = productRepository.create({
      name,
      price,
      quantity,
    });

    await productRepository.save(product);

    return product;
  }

  public async findAll(): Promise<Product[]> {
    const productRepository = getCustomRepository(ProductRepository);
    const products = await productRepository.find();
    return products;
  }

  public async find({ id }: IRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository);
    const product = await productRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found.');
    }
    return product;
  }

  public async update({
    id,
    name,
    price,
    quantity,
  }: IUpdateRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository);
    const product = await productRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found.');
    }

    const productExists = await productRepository.findByName(name);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productRepository.save(product);
    return product;
  }

  public async delete({ id }: IRequest): Promise<void> {
    const productRepository = getCustomRepository(ProductRepository);
    const product = await productRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found.');
    }
    await productRepository.remove(product);
  }
}
