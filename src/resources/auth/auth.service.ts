import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { UsersEntity } from '@common/database/entities';
import { ERROR_MESSAGES } from '@common/erorr-mesagges';
import {
  IAuthToken,
  IJwtConfig,
  ILogin,
  ILoginResponse,
  IRegistration,
  ITokenPayload,
} from '@common/models';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshSecret: string;
  private jwtRefreshExpiresIn: string;
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const jwtConfig = this.configService.get<IJwtConfig>('JWT_CONFIG');

    if (!jwtConfig) {
      throw new Error('JWT_CONFIG is not defined in ConfigService');
    }

    this.jwtSecret = jwtConfig.secret;
    this.jwtExpiresIn = jwtConfig.expiresIn;
    this.jwtRefreshSecret = jwtConfig.refreshSecret;
    this.jwtRefreshExpiresIn = jwtConfig.refreshExpiresIn;
  }

  /**
   * Creates a new user in the database and returns an authentication token.
   * @param {IRegistration} body - User registration details.
   * @returns {IAuthToken} - Authentication token for the newly registered user.
   */

  async registration(body: IRegistration): Promise<{ success: boolean }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    body.password = await bcrypt.hash(body.password, 10);

    const { id } = await this.userRepository.save({ ...body });
    const tokens = this.generateTokens({ id });
    await this.saveRefreshToken(id, tokens.refreshToken);

    return { success: true };
  }

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
      throw new BadRequestException(ERROR_MESSAGES.USER_INVALID_CREDENTIALS);
    }

    const tokens = this.generateTokens({
      id: user.id,
    });

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Verifies the refresh token, generates new tokens if valid.
   * @param {string} refreshToken - Refresh token to validate and use.
   * @returns {IAuthToken} - Newly issued tokens.
   */

  async refresh(refreshToken: string): Promise<IAuthToken> {
    try {
      const { id: userId } = this.jwtService.verify<ITokenPayload>(
        refreshToken,
        {
          secret: this.jwtRefreshSecret,
        },
      );

      const isValid = await this.validateRefreshToken(userId, refreshToken);
      if (!isValid)
        throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);

      const tokens = this.generateTokens({ id: userId });
      await this.saveRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(JSON.stringify(err));
      throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED, error);
    }
  }

  /**
   * Logs out the user by removing the stored refresh token.
   * @param {string} userId - ID of the user to log out.
   */

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  /**
   * Generates access and refresh JWT tokens.
   * @param {ITokenPayload} payload - Data to embed in the token.
   * @returns {IAuthToken} - Access and refresh tokens.
   */

  private generateTokens(payload: ITokenPayload): IAuthToken {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: this.jwtExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: this.jwtRefreshExpiresIn,
    });
    return { accessToken, refreshToken };
  }

  /**
   * Saves a hashed version of the refresh token in the database.
   * @param {string} userId - ID of the user.
   * @param {string} refreshToken - Raw refresh token to hash and store.
   */

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hashed });
  }

  /**
   * Validates the refresh token against the stored hash in the database.
   * @param {string} userId - ID of the user.
   * @param {string} token - Refresh token to verify.
   * @returns {Promise<boolean>} - Whether the token is valid.
   */

  private async validateRefreshToken(
    userId: string,
    token: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) return false;
    return bcrypt.compare(token, user.refreshToken);
  }
}
