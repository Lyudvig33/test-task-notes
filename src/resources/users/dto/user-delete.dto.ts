import { ApiProperty } from '@nestjs/swagger';

export class UserDeleteDto {
  @ApiProperty()
  deleted: boolean;
}
