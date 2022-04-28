import Customer from '@modules/customers/typeorm/entities/Customer';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import OrdersProducts from './OrdersProducts';

@Entity('orders')
export default class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(()=> Customer)
  @JoinColumn({name:'customer_id'})
  customer: Customer;

  @OneToMany(()=> OrdersProducts, orders_products => orders_products.order,{
    cascade:true
  })
  orders_products:OrdersProducts[]

   @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


}
