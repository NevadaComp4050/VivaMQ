import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsString()
  convenorId: string;
}
