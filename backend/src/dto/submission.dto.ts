import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  submissionFile: string;

  @IsString()
  @IsNotEmpty()
  assignmentId: string;
}
