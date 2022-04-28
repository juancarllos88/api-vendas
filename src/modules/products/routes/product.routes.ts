import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { celebrate, Joi, Segments } from 'celebrate';

const productRoutes = Router();
const controller = new ProductController();
productRoutes.get('/', controller.findAll);

productRoutes.get(
  '/:id',
  celebrate({ [Segments.PARAMS]: { id: Joi.string().required() } }),
  controller.find,
);
productRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  controller.create,
);

productRoutes.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().required() },
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  controller.update,
);

productRoutes.delete(
  '/:id',
  celebrate({ [Segments.PARAMS]: { id: Joi.string().required() } }),
  controller.delete,
);

export default productRoutes;
