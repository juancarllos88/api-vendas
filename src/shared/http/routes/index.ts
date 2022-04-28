import productRoutes from '@modules/products/routes/product.routes';
import sessionRoutes from '@modules/users/routes/session.routes';
import userRoutes from '@modules/users/routes/user.routes';
import customerRoutes from '@modules/customers/routes/customer.routes';

import { Router } from 'express';

const routes = Router();
routes.use('/products', productRoutes);
routes.use('/users', userRoutes);
routes.use('/token', sessionRoutes);
routes.use('/customers', customerRoutes);

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello Dev!' });
});

export default routes;
