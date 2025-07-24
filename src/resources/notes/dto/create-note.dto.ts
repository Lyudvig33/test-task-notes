import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty()
  @IsString()
  body: string;
}
