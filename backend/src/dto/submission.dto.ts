import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  @IsString({ message: 'the assignmentId must be a string' })
  @IsNotEmpty({ message: 'the assignmentId must not be empty' })
  assignmentId: string;
}
