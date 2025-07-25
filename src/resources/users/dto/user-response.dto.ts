import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@common/database/base';

export class UserResponseDto extends BaseEntity {
  @ApiProperty()
  email: string;
}
