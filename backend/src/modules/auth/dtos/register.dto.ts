import { 
  IsString, 
  IsEmail, 
  MinLength, 
  IsOptional,
  IsPhoneNumber,
  Matches 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username for login',
  })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Password for login',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Password confirmation',
  })
  @IsString({ message: 'Password confirmation must be a string' })
  @Matches('password', { 
    message: 'Passwords do not match' 
  })
  confirmPassword: string;

  @ApiPropertyOptional({
    example: '+5511999999999',
    description: 'Phone number',
  })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Phone must be a valid Brazilian number' })
  phone?: string;
}
