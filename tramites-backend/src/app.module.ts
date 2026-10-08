import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserProceduresModule } from './user-procedures/user-procedures.module.js';

// Comprobar si existen claves reales de Observe en las variables de entorno
const hasObserveKeys =
  Boolean(process.env.OBSERVE_APP_KEY) &&
  process.env.OBSERVE_APP_KEY !== 'YOUR_APP_KEY';

// Inicializar la instrumentación solo si las claves son válidas
export const { ObserveModule, ObserveInstrument } = hasObserveKeys
  ? createObserveModule()
  : { ObserveModule: null, ObserveInstrument: undefined };

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserProceduresModule,
    // Cargar ObserveModule únicamente cuando existan credenciales válidas
    ...(hasObserveKeys && ObserveModule
      ? [
          ObserveModule.forRoot({
            appKey: process.env.OBSERVE_APP_KEY!,
            appSecret: process.env.OBSERVE_APP_SECRET!,
            serviceId: 'tramites-backend',
          }),
        ]
      : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}