import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ProcedureStatus } from '../../generated/prisma/enums.js';

export class UpdateUserProcedureDto {
  @IsOptional()
  @IsEnum(ProcedureStatus)
  status?: ProcedureStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  officialUrl?: string;
}