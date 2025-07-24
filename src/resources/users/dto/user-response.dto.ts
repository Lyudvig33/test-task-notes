import { BaseEntity } from '@common/database/base';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto extends BaseEntity {
  @ApiProperty()
  email: string;

  @ApiProperty()
  oraginaziatoionId: string;
}
