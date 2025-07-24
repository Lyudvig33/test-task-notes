import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthToken,
  ILogin,
  ILoginResponse,
  IRegistration,
  ITokenPayload,
} from '@common/models';
import { ERROR_MESSAGES } from '@common/erorr-mesagges';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Creates a new user in the database and returns an authentication token.
   * @param {IRegistration} body - User registration details.
   * @returns {IAuthToken} - Authentication token for the newly registered user.
   */

  async registration(body: IRegistration): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    body.password = await bcrypt.hash(body.password, 10);

    const userToSave = {
      ...body,
    };
    const { id } = await this.userRepository.save(userToSave);

    const user = await this.userRepository.findOne({ where: { id } });
    const tokens = this.generateTokens({ id });
    await this.saveRefreshToken(id, tokens.refreshToken);

    return true;
  }

  /**
   * Generates a JWT access token based on the provided payload.
   * @param {ITokenPayload} payload - Data to be included in the token.
   * @returns {Promise<string>} - Signed JWT access token.
   */

  /**
   * Authenticates a user by checking credentials and returns an authentication token.
   * @param {ILogin} body - User login details.
   * @returns {ILoginResponse} - Authentication token if login is successful.
   */

  async login(body: ILogin): Promise<ILoginResponse> {
    const { login, password } = body;

    const user = await this.userRepository.findOne({
      where: { email: login },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_INVALID_PASSWORD);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new BadRequestException(ERROR_MESSAGES.USER_INVALID_PASSWORD);
    }

    const tokens = this.generateTokens({
      id: user.id,
    });

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refresh(refreshToken: string): Promise<IAuthToken> {
    try {
      const payload = this.jwtService.verify<ITokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const userId = payload.id;

      const isValid = await this.validateRefreshToken(userId, refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const tokens = this.generateTokens({ id: userId });
      await this.saveRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(JSON.stringify(err));
      throw new UnauthorizedException('Token is invalid or expired', error);
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  private generateTokens(payload: ITokenPayload): IAuthToken {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_SECRET_EXPIRES_IN',
      ),
    });
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hashed });
  }

  private async validateRefreshToken(
    userId: string,
    token: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) return false;
    return bcrypt.compare(token, user.refreshToken);
  }
}
