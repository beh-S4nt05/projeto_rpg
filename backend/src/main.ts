import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:19006',
    credentials: true,
  });

  // Swagger API Documentation
  const swaggerEnabled = configService.get<string>('SWAGGER_ENABLED') !== 'false';
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('RPG Game API')
      .setDescription('API for RPG Game - User management, characters, inventory, etc.')
      .setVersion('2.0.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('avatars', 'Avatar management endpoints')
      .addTag('atributos', 'Attributes management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = configService.get<string>('SWAGGER_PATH') || '/api';
    SwaggerModule.setup(swaggerPath, app, document);
  }

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  if (swaggerEnabled) {
    console.log(`Swagger docs available at: http://localhost:${port}/api`);
  }
}

bootstrap();
