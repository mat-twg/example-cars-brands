import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVICE_PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      operationsSorter: false,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port, () =>
    Logger.log(
      clc.cyanBright(`Server started on port: ${port}`),
      'NestApplication',
    ),
  );
}
(async () => await bootstrap())();
