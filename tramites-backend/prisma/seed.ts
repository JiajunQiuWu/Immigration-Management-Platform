import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { ProcedureStatus, UserRole } from '../src/generated/prisma/enums.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL debe estar configurado');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const adminPasswordHash = await bcrypt.hash('AdminDemo2026!', 12);
  const userPasswordHash = await bcrypt.hash('UsuarioDemo2026!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@tramites.local' },
    update: { passwordHash: adminPasswordHash, role: UserRole.ADMIN },
    create: {
      email: 'admin@tramites.local',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'usuario@tramites.local' },
    update: { passwordHash: userPasswordHash, role: UserRole.USER },
    create: {
      email: 'usuario@tramites.local',
      passwordHash: userPasswordHash,
      role: UserRole.USER,
    },
  });

  const procedures = [
    {
      id: '7d48705d-ea41-4f7e-8cbf-0ed77f0cd501',
      procedureCode: 'Renovación de Residencia',
      status: ProcedureStatus.pending,
    },
    {
      id: '7d48705d-ea41-4f7e-8cbf-0ed77f0cd502',
      procedureCode: 'Arraigo Social',
      status: ProcedureStatus.in_progress,
    },
    {
      id: '7d48705d-ea41-4f7e-8cbf-0ed77f0cd503',
      procedureCode: 'Asignación de NIE',
      status: ProcedureStatus.completed,
    },
  ];

  for (const procedure of procedures) {
    await prisma.userProcedure.upsert({
      where: { id: procedure.id },
      update: {
        userId: user.id,
        procedureCode: procedure.procedureCode,
        status: procedure.status,
      },
      create: { ...procedure, userId: user.id },
    });
  }

  console.info('Seed completado: administrador, usuario y 3 trámites de prueba.');
  console.info('Credenciales demo: admin@tramites.local / AdminDemo2026!');
  console.info('Credenciales demo: usuario@tramites.local / UsuarioDemo2026!');
}

main()
  .catch((error: unknown) => {
    console.error('Error al ejecutar el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });