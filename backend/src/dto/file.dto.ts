import { IsString, IsNotEmpty } from 'class-validator';

export default class CreateFileDto {
  @IsString()
  filename: string;

  @IsString()
  fileUrl: string;

  @IsString()
  studentId: string;
}