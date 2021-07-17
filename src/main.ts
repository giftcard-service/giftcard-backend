import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Set global API prefix */
  app.setGlobalPrefix('v1');

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
