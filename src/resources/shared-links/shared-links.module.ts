import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteEntity, ShareLinkEntity } from '@common/database/entities';
import { IJwtConfig } from '@common/models';

import { SharedLinksController } from './shared-links.controller';
import { SharedLinksService } from './shared-links.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<IJwtConfig>('JWT_CONFIG');
        if (!jwtConfig) {
          throw new Error('JWT_CONFIG is not defined');
        }
        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([ShareLinkEntity, NoteEntity]),
  ],
  controllers: [SharedLinksController],
  providers: [SharedLinksService],
})
export class SharedLinksModule {}
