import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteEntity, UsersEntity } from '@common/database/entities';
import { IJwtConfig } from '@common/models';

import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

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
    TypeOrmModule.forFeature([UsersEntity, NoteEntity]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
