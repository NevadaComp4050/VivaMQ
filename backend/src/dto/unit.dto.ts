import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty({ message: 'the unit name should not be empty' })
  name: string;

  @IsInt({ message: 'the year must be an integer' })
  @IsNotEmpty({ message: 'the year should not be empty' })
  year: number;

  @IsString()
  @IsNotEmpty({ message: 'the Convenor ID should not be empty' })
  convenorId: string;
}