import { IsString, IsEmail, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe Updated', description: 'New full name' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'john.updated@example.com', description: 'New email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999', description: 'New phone number' })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Phone must be a valid Brazilian number' })
  phone?: string;
}
