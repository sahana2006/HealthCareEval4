import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // ── Swagger / OpenAPI setup ────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MEDBITS Healthcare API')
    .setDescription(
      'REST API for the MEDBITS Healthcare Management System.\n\n' +
      '**Authentication**: Pass the user role in the `role` request header.\n\n' +
      'Valid roles: `patient` | `doctor` | `frontdesk` | `admin`',
    )
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'role', in: 'header', description: 'User role for RBAC' },
      'role',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'MEDBITS API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running on http://localhost:3000`);
  console.log(`Swagger docs available at http://localhost:3000/api/docs`);
}
bootstrap();
