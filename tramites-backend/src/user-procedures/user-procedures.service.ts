import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserProcedureDto } from './dto/create-user-procedure.dto.js';
import { UpdateUserProcedureDto } from './dto/update-user-procedure.dto.js';

@Injectable()
export class UserProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.userProcedure.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, dto: CreateUserProcedureDto) {
    return this.prisma.userProcedure.create({
      data: {
        userId,
        procedureCode: dto.procedureCode,
        region: dto.region,
        officialUrl: dto.officialUrl,
        appointmentDate: dto.appointmentDate ? new Date(dto.appointmentDate) : undefined,
        notes: dto.notes,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateUserProcedureDto) {
    try {
      return await this.prisma.userProcedure.update({
        where: { id, userId },
        data: dto,
      });
    } catch (error) {
      this.throwIfNotFound(error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      return await this.prisma.userProcedure.delete({
        where: { id, userId },
      });
    } catch (error) {
      this.throwIfNotFound(error);
    }
  }

  private throwIfNotFound(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Trámite no encontrado');
    }
    throw error;
  }
}