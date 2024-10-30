import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  @IsString({ message: 'the name must be a string' })
  @IsNotEmpty({ message: 'the name must not be empty' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'the email must not be empty' })
  email: string;
}

export class MapFilesDto {
  @IsString({ message: 'the studentId must be a string' })
  studentId: string;
}
