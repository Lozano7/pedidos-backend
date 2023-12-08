import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { CORS } from './constants';

//Carga las variables de entorno desde el archivo .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const configService = app.get(ConfigService);

  app.enableCors(CORS);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || configService.get('PORT') || 3000);
}
bootstrap();
