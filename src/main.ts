import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { initializeTransactionalContext } from 'typeorm-transactional';

import { AllExceptionsFilter } from '@common/filters';
import { ResponseManager } from '@common/helpers';
import { ResponseTransformInterceptor } from '@common/interseptors';
import { IValidationErrors } from '@common/models/response';

import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;
process.env.TZ = 'Etc/UTC';
async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors();
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseTransformInterceptor(),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: false,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorResponse: IValidationErrors[] = [];
        errors.forEach((e) => {
          if (e.constraints) {
            errorResponse.push(...ResponseManager.validationHandler([e]));
          }
          if (e.children) {
            errorResponse.push(
              ...ResponseManager.validationHandler(
                e.children,
                e.property?.toLowerCase(),
              ),
            );
          }
        });
        return errorResponse;
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Test-Task REST API v1.0')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: 'Test-Task REST API',
  });

  await app.listen(PORT, '0.0.0.0', () =>
    console.log('Server Started On Port', PORT),
  );
}
bootstrap();
