import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  
  @IsString({ message: 'the assignmentId must be a string' })
  @IsNotEmpty({ message: 'the assignmentId must not be empty' })
  assignmentId: string;

  @IsString({ message: 'the studentId must be a string' })
  @IsNotEmpty({ message: 'the studentId must not be empty' })
  studentId: string;

  @IsString({ message: 'the submissionFile must be a string' })
  @IsNotEmpty({ message: 'the submissionFile must not be empty' })
  submissionFile: string;
}

