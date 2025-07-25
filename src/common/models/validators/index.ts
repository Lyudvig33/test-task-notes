import * as Joi from 'joi';

import { Enviroment, NodeEnv } from '@common/enums';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnv))
    .default(NodeEnv.Development),
  PORT: Joi.number().default(5000),
  ENVIRONMENT: Joi.string()
    .valid(...Object.values(Enviroment))
    .default(Enviroment.Development),
  APP_VERSION: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_USER: Joi.string().default('root'),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET_EXPIRES_IN: Joi.string().required(),
});
