import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  phone: string;

  @IsString()
  password: string;
}
