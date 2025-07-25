import { ApiProperty } from '@nestjs/swagger';

import { IsInt, Max, Min } from 'class-validator';

export class CreateSharedLinkDto {
  @ApiProperty({ example: 30, minimum: 5, maximum: 1440 })
  @IsInt()
  @Min(5)
  @Max(1440)
  ttlMinutes: number;
}
