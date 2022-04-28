import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrderRepository from '../typeorm/repositories/OrderRepository';

export default class OrderService {
  async find(id: number): Promise<Order | undefined> {
    const orderRepository = getCustomRepository(OrderRepository);
    const order = await orderRepository.findById(id);
    return order;
  }
}
