import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateUserProcedureDto {
  @IsString()
  @MaxLength(100)
  procedureCode!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  officialUrl?: string;

  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}