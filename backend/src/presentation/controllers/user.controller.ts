import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { UserDomainService } from '../../core/services/user.service';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserResponseDto } from '../dtos/response/user.response.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserDomainService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Validar se senhas coincidem
    if (createUserDto.password !== createUserDto.co_password) {
      throw new Error('Passwords do not match');
    }

    const user = await this.userService.registerUser(
      createUserDto.username,
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      createUserDto.phone,
    );

    return new UserResponseDto(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserResponseDto(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserResponseDto(user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Atualizar dados do usuário
    user.updateProfile({
      name: updateUserDto.name,
      email: updateUserDto.email,
      phone: updateUserDto.phone,
    });

    const updatedUser = await this.userService.updateUser(user);
    return new UserResponseDto(updatedUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
