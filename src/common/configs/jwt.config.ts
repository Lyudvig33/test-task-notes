import { registerAs } from '@nestjs/config';

import { IJwtConfig } from '@common/models';

export default registerAs(
  'JWT_CONFIG',
  (): IJwtConfig => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
  }),
);
