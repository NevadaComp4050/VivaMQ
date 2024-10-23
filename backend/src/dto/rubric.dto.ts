import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRubricDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @IsString()
  @IsNotEmpty()
  rubricFile: string;
}

export class LinkRubricToAssignmentDto {
  @IsString()
  @IsNotEmpty()
  rubricId: string;

  @IsString()
  @IsNotEmpty()
  assignmentId: string;
}
