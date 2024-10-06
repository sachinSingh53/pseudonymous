import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useRequestLogging } from './middlewares/request-logging';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useRequestLogging(app);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow only your frontend origin
    credentials: true, // Allow credentials (cookies, etc.)
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  
  const BASE_PATH = '/api/v1';
  app.setGlobalPrefix(BASE_PATH, {
    // exclude: pathsToExclude,
  });
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
