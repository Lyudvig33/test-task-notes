import { ApiProperty } from '@nestjs/swagger';

import { IAuthToken } from '@common/models';

export class AuthTokenDTO implements IAuthToken {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
