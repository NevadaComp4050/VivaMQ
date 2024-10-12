import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @IsString({ message: 'the name must be a string' })
  @IsNotEmpty({ message: 'the name must not be empty' })
  name: string;

  @IsInt({ message: 'the year must be an integer' })
  @IsNotEmpty({ message: 'the year must not be empty' })
  year: number;

  // @IsString({ message: 'the convenorId must be a string' })
  // @IsNotEmpty({ message: 'the convenorId must not be empty' })
  // convenorId: string;
}