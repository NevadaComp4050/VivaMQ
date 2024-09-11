import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  options: string[];

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  options: string[];

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}