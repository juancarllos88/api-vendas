import OrdersProducts from '@modules/orders/typeorm/entities/OrdersProducts';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => OrdersProducts, orders_products => orders_products.product)
  orders_products: OrdersProducts[];

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
