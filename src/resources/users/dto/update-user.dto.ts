import { VALIDATION_PATTERNS } from '@common/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'joe@gmail.com' })
  email?: string;

  @Matches(VALIDATION_PATTERNS.PASSWORD)
  @MinLength(8)
  @MaxLength(60)
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'newpassword1!' })
  password?: string;
}
