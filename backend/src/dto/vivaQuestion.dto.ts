import { Submission } from '@prisma/client';
import {IsString} from 'class-validator';

export class CreateVivaQuestionDto {
  @IsString()
  id: string;

  @IsString()
  submissionId: string;

  @IsString()
  question: string;

  @IsString()
  status: string;
}
