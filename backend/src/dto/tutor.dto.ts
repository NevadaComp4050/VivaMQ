import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateTutorDto {
  @IsString({ message: 'the name must be a string' })
  @IsNotEmpty({ message: 'the name must not be empty' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'the email must not be empty' })
  email: string;

  @IsString({ message: 'the unitId must be a string' })
  @IsNotEmpty({ message: 'the unitId must not be empty' })
  unitId: string;
}
