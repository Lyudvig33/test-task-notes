import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '@common/decorators';
import { SuccessDTO } from '@common/dtos';
import { AuthUserGuard } from '@common/guards';
import { ITokenPayload } from '@common/models';

import { AuthService } from './auth.service';
import {
  AuthTokenDTO,
  LoginDto,
  RefreshTokenDto,
  RegistrationDto,
} from './dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registered a new user',
  })
  async create(@Body() body: RegistrationDto) {
    return this.authService.registration(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticates a user and returns tokens',
  })
  async login(@Body() body: LoginDto): Promise<AuthTokenDTO> {
    return this.authService.login(body);
  }

  @Post('/refresh')
  @ApiResponse({ type: AuthTokenDTO })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens using refreshToken' })
  async refresh(@Body() body: RefreshTokenDto): Promise<AuthTokenDTO> {
    return this.authService.refresh(body.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: SuccessDTO })
  @ApiOperation({ summary: 'Logout user (clears refresh token)' })
  async logout(@AuthUser() user: ITokenPayload): Promise<boolean> {
    try {
      await this.authService.logout(user.id);
      return true;
    } catch (err) {
      console.warn('Logout error:', err);
      return false;
    }
  }
}
