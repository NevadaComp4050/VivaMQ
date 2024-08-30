import { IsEmail, IsString } from 'class-validator';

export class CreateTutorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
