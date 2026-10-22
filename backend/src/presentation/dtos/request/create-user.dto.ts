import { IsString, IsEmail, IsStrongPassword, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username for login' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Password for login' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }, { message: 'Password must be at least 6 characters with 1 number' })
  password: string;

  @ApiProperty({ example: 'Password123!', description: 'Password confirmation' })
  @IsString({ message: 'Password confirmation must be a string' })
  co_password: string;

  @ApiPropertyOptional({ example: '+5511999999999', description: 'Phone number' })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Phone must be a valid Brazilian number' })
  phone?: string;
}
