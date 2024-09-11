import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  aiModel: string;

  @IsString()
  @IsNotEmpty()
  specs: string;

  @IsString()
  @IsNotEmpty()
  settings: string;

  @IsString()
  @IsNotEmpty()
  unitId: string;
}
