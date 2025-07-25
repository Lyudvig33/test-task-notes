import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '@common/decorators';
import { AuthUserGuard } from '@common/guards';
import { ITokenPayload } from '@common/models';

import { CreateSharedLinkDto, ShareLinkResponseDto } from './dto/';
import { SharedLinksService } from './shared-links.service';

@ApiTags('Share Link')
@Controller('shared-links')
export class SharedLinksController {
  constructor(private sharedLinksService: SharedLinksService) {}

  @ApiOperation({ summary: 'Create one-time share link' })
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiResponse({ type: ShareLinkResponseDto })
  @Post('/notes/:id/share')
  async create(
    @Param('id') id: string,
    @AuthUser() user: ITokenPayload,
    @Body() body: CreateSharedLinkDto,
  ) {
    return this.sharedLinksService.create(id, user.id, body);
  }

  @ApiOperation({ summary: 'Open shared note via link (no auth)' })
  @ApiResponse({ type: ShareLinkResponseDto })
  @Get('/public/notes/:token')
  async open(@Param('token') token: string) {
    return this.sharedLinksService.findPublic(token);
  }

  @ApiOperation({ summary: 'Get list of links for a note' })
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @Get('/notes/:id/share')
  async list(@Param('id') id: string, @AuthUser() user: ITokenPayload) {
    return this.sharedLinksService.list(id, user.id);
  }

  @ApiOperation({ summary: 'Revoke specific link by ID' })
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @Delete('/notes/:id/share/:tokenId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(
    @Param('id') id: string,
    @Param('tokenId') tokenId: string,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.sharedLinksService.revoke(id, tokenId, user.id);
  }
}
