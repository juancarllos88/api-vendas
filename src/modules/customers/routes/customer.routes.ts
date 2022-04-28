import CustomerController from '../controllers/CustomerController';
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

const customerRoutes = Router();
const customerController = new CustomerController();

customerRoutes.get('/', customerController.findAll);

customerRoutes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().required() },
  }),
  customerController.find,
);

customerRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  customerController.create,
);

customerRoutes.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().required() },
  }),
  customerController.delete,
);

customerRoutes.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
    [Segments.PARAMS]: { id: Joi.string().required() },
  }),
  customerController.update,
);

export default customerRoutes;
