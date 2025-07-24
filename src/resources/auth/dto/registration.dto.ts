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

export class RegistrationDto implements IRegistration {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'joe@gmail.com',
  })
  email: string;

  @Matches(VALIDATION_PATTERNS.PASSWORD, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @MinLength(8)
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password1!' })
  password: string;

}
