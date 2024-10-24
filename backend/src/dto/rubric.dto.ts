import {
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRubricDto {
  @IsUUID()
  @IsOptional()
  id?: string; // Optional, will generate if not provided

  @IsString()
  title: string;

  @IsOptional()
  assignmentId: string | undefined;

  @IsString()
  assessmentTask: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  criteria: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keywords: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  learningObjectives: string[];

  @IsString()
  existingGuide: string;
}

export class UpdateRubricDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RubricDataDto)
  rubricData?: RubricDataDto;
}

class RubricDataDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CriterionDto)
  criteria: CriterionDto[];
}

class CriterionDto {
  @IsString()
  name: string;

  @IsString()
  marks: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DescriptorDto)
  descriptors?: DescriptorDto;
}

class DescriptorDto {
  @IsString()
  F: string;

  @IsString()
  P: string;

  @IsString()
  C: string;

  @IsString()
  D: string;

  @IsString()
  HD: string;
}
