import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity, UsersEntity } from '@common/database/entities';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_CONFIG.secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_CONFIG.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UsersEntity, NoteEntity]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
