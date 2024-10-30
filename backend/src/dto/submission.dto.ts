import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VIVASTATUS } from '@prisma/client';

export class CreateSubmissionDto {
  @IsUUID()
  @IsNotEmpty({ message: 'The assignmentId must not be empty' })
  assignmentId: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsNotEmpty({ message: 'The submissionFile must not be empty' })
  submissionFile: string;

  @IsString()
  @IsNotEmpty({ message: 'The status must not be empty' })
  status: string;

  @IsString()
  @IsOptional()
  studentCode?: string;
}

export class VivaQuestionDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  question: any;

  @IsString()
  @IsNotEmpty()
  status: string;
}

export class SubmissionResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  assignmentId: string;

  @IsString()
  @IsNotEmpty()
  assignmentName: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsNotEmpty()
  submissionFile: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsEnum(VIVASTATUS)
  vivaStatus: VIVASTATUS;

  @IsString()
  @IsOptional()
  studentCode?: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsString()
  @IsOptional()
  qualityAssessment?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  vivaRequestDate?: Date;

  @ValidateNested({ each: true })
  @Type(() => VivaQuestionDto)
  vivaQuestions: VivaQuestionDto[];
}
