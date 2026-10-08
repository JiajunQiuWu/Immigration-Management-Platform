import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  // Pasar 'instrument' a las opciones solo si ObserveInstrument está definido
  const appOptions = ObserveInstrument ? { instrument: ObserveInstrument } : {};

  const app = await NestFactory.create(AppModule, appOptions);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();