import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { AppModule } from './app.module';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const servicePort = config.get<string>('PORT', '3000');
  const NODE_ENV = config.get<string>('NODE_ENV', 'development');

  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', '*'),
    methods: config.get<string>('CORS_METHODS', 'GET,PUT,POST,DELETE'),
    credentials: config.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: config.get<boolean>('CORS_PREFLIGHT', false),
    optionsSuccessStatus: config.get<number>('CORS_OPTIONS_STATUS', 204),
  });
  app.use(
    session({
      secret: config.get<string>(
        'SESSION_SECRET',
        Math.random().toString(36).slice(2),
      ),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  Logger.debug(`Static Path: ${path.join(__dirname, '..', 'public')}`);
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  Logger.debug(`Base View Path: ${path.join(__dirname, '..', 'views')}`);
  app.setViewEngine('ejs');

  if (config.get<boolean>('SWAGGER_ENABLED', NODE_ENV === 'development')) {
    await swagger(app);
  }

  await app.listen(servicePort);

  Logger.log(
    `Server is running on http://localhost:${servicePort}/ with ${NODE_ENV} mode`,
    'Bootstrap',
  );
}
bootstrap();
