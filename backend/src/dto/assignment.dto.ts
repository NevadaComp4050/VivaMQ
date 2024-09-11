import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAssignmentDto {
  @IsString({ message: 'the name must be a string' })
  @IsNotEmpty({ message: 'the name must not be empty' })
  name: string;

  @IsString({ message: 'the aiModel must be a string' })
  @IsNotEmpty({ message: 'the aiModel must not be empty' })
  aiModel: string;

  @IsString({ message: 'the specs must be a string' })
  @IsNotEmpty({ message: 'the specs must not be empty' })
  specs: string;

  @IsString({ message: 'the settings must be a string' })
  @IsNotEmpty({ message: 'the settings must not be empty' })
  settings: string;

  @IsString({ message: 'the unitId must be a string' })
  @IsNotEmpty({ message: 'the unitId must not be empty' })
  unitId: string;
}
