import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username for login',
  })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Password for login',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
