import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Unique user identifier' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @Expose()
  email: string;

  @ApiPropertyOptional({ example: '+5511999999999', description: 'Phone number' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
  @Expose()
  updatedAt: Date;

  constructor(user: {
    id: string;
    username: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = user.id;
    this.username = user.username;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
