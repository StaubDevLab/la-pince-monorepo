import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
if (expressApp && typeof expressApp.set === 'function') {
  expressApp.set('trust proxy', true); // ou 1 pour “un proxy” en amont
}
  app.setGlobalPrefix('v1/api');

  const config = new DocumentBuilder()
    .setTitle('La-Pince API')
    .setDescription('The API description of La-Pince application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    useGlobalPrefix: false,
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
