import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'the email must not be empty' })
  email: string;

  @IsString({ message: 'the name must be a string' })
  @IsNotEmpty({ message: 'the name must not be empty' })
  name: string;

  @IsOptional()
  @IsString({ message: 'the phone must be a string' })
  phone: string;

  @IsString({ message: 'the password must be a string' })
  @IsNotEmpty({ message: 'the password must not be empty' })
  password: string;
}
