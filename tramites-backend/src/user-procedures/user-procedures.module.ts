import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { UserProceduresController } from './user-procedures.controller.js';
import { UserProceduresService } from './user-procedures.service.js';

@Module({
  imports: [AuthModule],
  controllers: [UserProceduresController],
  providers: [UserProceduresService],
})
export class UserProceduresModule {}