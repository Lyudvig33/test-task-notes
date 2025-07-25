import { ApiProperty } from '@nestjs/swagger';

export class ShareLinkResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  expiresAt: Date;
  @ApiProperty()
  isUsed: boolean;
  @ApiProperty()
  isRevoked: boolean;
}
