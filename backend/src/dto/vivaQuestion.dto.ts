import {IsString, IsNotEmpty} from 'class-validator';

export class CreateVivaQuestionDto {
  @IsString({ message: 'the submissionId must be a string' })
  @IsNotEmpty({ message: 'the submissionId must not be empty' })
  submissionId: string;

  @IsString({ message: 'the question must be a string' })
  @IsNotEmpty({ message: 'the question must not be empty' })
  question: string;

  @IsString({ message: 'the status must be a string' })
  @IsNotEmpty({ message: 'the status must not be empty' })
  status: string;
}