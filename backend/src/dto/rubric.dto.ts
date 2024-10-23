import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class DescriptorDto {
  @IsString()
  @IsNotEmpty()
  F: string;

  @IsString()
  @IsNotEmpty()
  P: string;

  @IsString()
  @IsNotEmpty()
  C: string;

  @IsString()
  @IsNotEmpty()
  D: string;

  @IsString()
  @IsNotEmpty()
  HD: string;
}

class CriterionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DescriptorDto)
  descriptors: DescriptorDto;

  @IsNumber()
  @IsNotEmpty()
  marks: number;
}

export class CreateRubricDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  assignmentId: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CriterionDto)
  criteria: CriterionDto[];
}

export class UpdateRubricDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CriterionDto)
  criteria?: CriterionDto[];
}

export class LinkRubricToAssignmentDto {
  @IsString()
  @IsNotEmpty()
  rubricId: string;

  @IsString()
  @IsNotEmpty()
  assignmentId: string;
}
