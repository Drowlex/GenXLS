import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { environment } from './environments/environment';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

function setupCors( app: INestApplication): void {
  const allowedOrigins = JSON.parse(environment.cors);
  app.enableCors({
    credentials: true, 
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
  });
}

function setupSwagger( app: INestApplication ): void {
  // Recuperamos la versión de compilación y despliegue
  const version = fs.readFileSync("version.txt",'utf-8');


  const options = new DocumentBuilder()
    .setTitle('GenXLS')
    .setDescription('Local API used for general xlsx')
    .setVersion(`0.0.${version.trim()}`)
    .addTag('generator')
    .build();

   const document = SwaggerModule.createDocument(app, options, {
      operationIdFactory: (
      controllerKey: string,
      methodKey: string,
      ) => methodKey
   });
   SwaggerModule.setup('docs', app, document);

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // https://github.com/nestjs/nest/issues/255
  app.setGlobalPrefix(environment.api);

  // Enable Cors
  setupCors(app);
  // Enable Swagger
  setupSwagger(app);

  await app.listen(environment.port);
}
bootstrap();
