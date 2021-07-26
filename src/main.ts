import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SwaggerCustomOptions } from './types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Set global API prefix */
  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  /* Set up for Swagger */
  const config = new DocumentBuilder()
    .setTitle('Giftcard Service API')
    .setDescription('The giftcard service API.')
    .setVersion('1.0')
    .build();

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Giftcard Service API Docs',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
