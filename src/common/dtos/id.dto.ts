import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from 'class-validator';

import { IId } from '@common/models';

export class IdDTO implements IId {
  @ApiProperty()
  @IsNumber()
  id: string;
}
