import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { ERROR_MESSAGES } from '@common/erorr-mesagges';
import { ITokenPayload } from '@common/models';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private readonly _jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    const [, accessToken] = authHeader.split(' ');
    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    try {
      const payload =
        await this._jwtService.verifyAsync<ITokenPayload>(accessToken);

      if (!payload || typeof payload !== 'object') {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
      }

      (request as Request & { user: ITokenPayload }).user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }
  }
}
