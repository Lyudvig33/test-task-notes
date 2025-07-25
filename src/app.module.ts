import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AuthModule } from '@resources/auth';
import { NotesModule } from '@resources/notes';
import { SharedLinksModule } from '@resources/shared-links';
import { UsersModule } from '@resources/users';

import { appConfig, dbConfig, jwtConfig } from '@common/configs';
import { ENV_CONST } from '@common/constants';
import { NodeEnv } from '@common/enums';
import validators from '@common/models/validators';

import * as ENTITIES from './common/database/entities';

const isProductionMode =
  (process.env.NODE_ENV as NodeEnv) === NodeEnv.Production;

const envFilePath = isProductionMode
  ? ENV_CONST.ENV_PATH_PROD
  : ENV_CONST.ENV_PATH_DEV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      expandVariables: true,
      validationSchema: validators,
      load: [jwtConfig, appConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: DataSourceOptions = {
          type: 'postgres',
          host: configService.get<string>(`DB_CONFIG.host`),
          port: configService.get<number>(`DB_CONFIG.port`),
          username: configService.get<string>(`DB_CONFIG.username`),
          password: configService.get<string>(`DB_CONFIG.password`),
          database: configService.get<string>(`DB_CONFIG.database`),
          synchronize: configService.get<boolean>(`DB_CONFIG.sync`),
          entities: Object.values(ENTITIES),
        };
        return options;
      },
      dataSourceFactory: (options: DataSourceOptions): Promise<DataSource> => {
        if (!options) {
          return Promise.reject(new Error('Invalid options passed'));
        }
        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    AuthModule,
    UsersModule,
    NotesModule,
    SharedLinksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
