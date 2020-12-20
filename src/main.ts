import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      preflightContinue: false,
    });
  } else {
    app.enableCors({
      origin: serverConfig.origin,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      preflightContinue: false,
    });
    logger.log(`Accepting request from origin: ${serverConfig.origin}`);
  }

  await app.listen(serverConfig.port);
  logger.log(
    `Application listening on port ${serverConfig.port} ${process.env.NODE_ENV}`,
  );
}
bootstrap();
