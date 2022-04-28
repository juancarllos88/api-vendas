import AppError from '@shared/errors/AppError';
import StatusCode from '@shared/util/StatusCode';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomerRepository';

const validateCustomer = (customer: Customer | undefined): Customer => {
  if (!customer) {
    throw new AppError('Customer not found.', StatusCode.NOT_FOUD);
  }
  return customer;
};

export default class CustomerService {
  public async find(id: number): Promise<Customer | undefined> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const customer = await customerRepository.findById(id);
    validateCustomer(customer);
    return customer;
  }

  public async findAll(): Promise<Customer[]> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const customers = await customerRepository.find();
    return customers;
  }

  public async save(name: string, email: string): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const emailExists = await customerRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.', StatusCode.BAD_REQUEST);
    }

    const customer = await customerRepository.create({
      name,
      email,
    });

    await customerRepository.save(customer);
    return customer;
  }

  public async delete(id: number): Promise<void> {
    const customersRepository = getCustomRepository(CustomersRepository);
    let customer = await customersRepository.findById(id);
    customer = validateCustomer(customer);
    await customersRepository.remove(customer);
  }

  public async update(
    id: number,
    name: string,
    email: string,
  ): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    let customer = await customersRepository.findById(id);
    customer = validateCustomer(customer);

    const customerExists = await customersRepository.findByEmail(email);

    if (customerExists && email !== customer?.email) {
      throw new AppError(
        'There is already one customer with this email.',
        StatusCode.BAD_REQUEST,
      );
    }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);

    return customer;
  }
}
