import {
  Controller,
  Get,
  Body,
  Patch,
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

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDeleteDto } from './dto/user-delete.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ type: UserResponseDto })
  async getMe(@AuthUser() user: ITokenPayload): Promise<UserResponseDto> {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current credentials' })
  @ApiResponse({ type: UserResponseDto })
  async update(
    @AuthUser() user: ITokenPayload,
    @Body() body: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.usersService.update(user.id, body);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ type: UserDeleteDto })
  async remove(@AuthUser() user: ITokenPayload): Promise<void> {
    await this.usersService.remove(user.id);
  }
}
