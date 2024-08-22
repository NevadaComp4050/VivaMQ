import { IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  name: string;

  @IsString()
  unit: string;

  @IsString()
  description: string;
}
