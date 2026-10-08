import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { JwtPayload } from '../auth/jwt.strategy.js';
import { CreateUserProcedureDto } from './dto/create-user-procedure.dto.js';
import { UpdateUserProcedureDto } from './dto/update-user-procedure.dto.js';
import { UserProceduresService } from './user-procedures.service.js';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('user/procedures')
@UseGuards(JwtAuthGuard)
export class UserProceduresController {
  constructor(private readonly service: UserProceduresService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.service.findAll(request.user.sub);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateUserProcedureDto) {
    return this.service.create(request.user.sub, dto);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateUserProcedureDto,
  ) {
    return this.service.update(id, request.user.sub, dto);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.remove(id, request.user.sub);
  }
}