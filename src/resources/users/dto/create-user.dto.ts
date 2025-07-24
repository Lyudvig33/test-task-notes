import { VALIDATION_PATTERNS } from '@common/constants';
import { IRegistration } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements IRegistration {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'joe@gmail.com',
  })
  email: string;

  @Matches(VALIDATION_PATTERNS.PASSWORD)
  @MinLength(8)
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password1!' })
  password: string;
}
