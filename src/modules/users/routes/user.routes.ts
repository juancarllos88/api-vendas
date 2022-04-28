import UserController from '../controllers/UserController';
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import multer from 'multer';
import uploadConfig from '@config/upload';

const userRoutes = Router();
const userController = new UserController();
const upload = multer(uploadConfig);

userRoutes.get('/', isAuthenticated, userController.findAll);

userRoutes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
  }),
  userController.find,
);

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

userRoutes.patch(
  '/avatar/:id',
  isAuthenticated,
  upload.single('avatar'),
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
  }),
  userController.updateAvatar,
);

userRoutes.post(
  '/password/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  userController.forgotPassword,
);

userRoutes.post(
  '/password/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  userController.resetPassword,
);

userRoutes.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    },
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
  }),
  userController.update,
);

export default userRoutes;
