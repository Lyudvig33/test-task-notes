import { registerAs } from '@nestjs/config';

import { IApp } from '@common/models';

export default registerAs(
  'APP_CONFIG',
  (): IApp => ({
    nodeEnv: process.env.NODE_ENV,
    environment: process.env.ENVIRONMENT,
  }),
);
