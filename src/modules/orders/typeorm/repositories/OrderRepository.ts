import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
  public async findById(id: number): Promise<Order | undefined> {
    const order = await this.findOne(id, {
      relations: ['orders_products', 'customer'],
    });
    return order;
  }
}
