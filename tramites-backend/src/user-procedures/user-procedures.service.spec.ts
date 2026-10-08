import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserProceduresService } from './user-procedures.service.js';

describe('UserProceduresService', () => {
  const prisma = {
    userProcedure: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const service = new UserProceduresService(prisma as unknown as PrismaService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('limits procedure queries to the authenticated user', async () => {
    prisma.userProcedure.findMany.mockResolvedValue([]);

    await service.findAll('user-123');

    expect(prisma.userProcedure.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('limits updates to the authenticated user and hides foreign procedures', async () => {
    prisma.userProcedure.update.mockRejectedValue({ code: 'P2025' });

    await expect(
      service.update('procedure-456', 'user-123', { status: 'completed' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.userProcedure.update).toHaveBeenCalledWith({
      where: { id: 'procedure-456', userId: 'user-123' },
      data: { status: 'completed' },
    });
  });

  it('persists official region details when updating a procedure', async () => {
    const data = {
      description: 'Solicitar cita previa',
      region: 'catalunya',
      officialUrl: 'https://sede.example.es/cita',
    };
    prisma.userProcedure.update.mockResolvedValue({ id: 'procedure-456', ...data });

    await service.update('procedure-456', 'user-123', data);

    expect(prisma.userProcedure.update).toHaveBeenCalledWith({
      where: { id: 'procedure-456', userId: 'user-123' },
      data,
    });
  });

  it('limits deletion to the authenticated user and hides foreign procedures', async () => {
    prisma.userProcedure.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.remove('procedure-456', 'user-123')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(prisma.userProcedure.delete).toHaveBeenCalledWith({
      where: { id: 'procedure-456', userId: 'user-123' },
    });
  });

  it('assigns new procedures to the authenticated user', async () => {
    prisma.userProcedure.create.mockResolvedValue({});

    await service.create('user-123', {
      procedureCode: 'NIE',
      region: 'madrid',
      officialUrl: 'https://sede.example.es/nie',
    });

    expect(prisma.userProcedure.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-123',
        procedureCode: 'NIE',
        region: 'madrid',
        officialUrl: 'https://sede.example.es/nie',
        appointmentDate: undefined,
        notes: undefined,
      },
    });
  });
});