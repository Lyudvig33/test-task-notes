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
import { UsersService } from './users.service';
import { AuthUserGuard } from '@common/guards';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDeleteDto } from './dto/user-delete.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ type: [UserResponseDto] })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get me' })
  @ApiResponse({ type: UserResponseDto })
  async findOne(@AuthUser() user: ITokenPayload) {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update current user' })
  @ApiResponse({ type: [UpdateUserDto] })
  @ApiResponse({ status: 200, description: 'user successfully updated' })
  async update(
    @AuthUser() user: ITokenPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete current user' })
  @ApiResponse({ type: UserDeleteDto })
  async remove(@AuthUser() user: ITokenPayload) {
    return this.usersService.remove(user.id);
  }
}
