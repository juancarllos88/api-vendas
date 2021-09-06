import productRoutes from '@modules/products/routes/product.routes';
import sessionRoutes from '@modules/users/routes/session.routes';
import userRoutes from '@modules/users/routes/user.routes';

import { Router } from 'express';

const routes = Router();
routes.use('/products', productRoutes);
routes.use('/users', userRoutes);
routes.use('/token', sessionRoutes);

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello Dev!' });
});

export default routes;
