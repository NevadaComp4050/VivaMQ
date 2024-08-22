import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  studentId: string;

  @IsString()
  groupId: string;
}

export class MapFilesDto {
  @IsString()
  studentId: string;
}
