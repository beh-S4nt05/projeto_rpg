import { 
  Injectable, 
  UnauthorizedException,
  ConflictException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Core
import { PrismaService } from '../../../core/prisma/prisma.service';
import { UsersService } from '../../users/services/users.service';

// DTOs
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    // Check if username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });
    
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        username: registerDto.username,
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        phone: registerDto.phone,
      },
    });

    // Create default avatar
    const defaultRace = await this.prisma.race.findFirst({
      where: { name: 'Humano' },
    });

    let raceId = 1;
    if (!defaultRace) {
      const createdRace = await this.prisma.race.create({
        data: {
          name: 'Humano',
          description: 'Raça humana padrão',
        },
      });
      raceId = createdRace.id;
    } else {
      raceId = defaultRace.id;
    }

    await this.prisma.avatar.create({
      data: {
        id: uuidv4(),
        name: registerDto.username,
        userId: user.id,
        raceId,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
      },
    });

    // Create default attributes
    await this.prisma.attributes.create({
      data: {
        id: uuidv4(),
        avatarId: (await this.prisma.avatar.findFirst({ where: { userId: user.id } }))?.id || '',
        strength: 10,
        agility: 10,
        defence: 10,
        resistance: 10,
        intelligence: 10,
        vitality: 10,
        energyPoints: 100,
        attributePoints: 5,
        skillPoints: 5,
      },
    });

    // Create default inventory
    await this.prisma.inventory.create({
      data: {
        id: uuidv4(),
        avatarId: (await this.prisma.avatar.findFirst({ where: { userId: user.id } }))?.id || '',
        maxWeight: 100,
        currentWeight: 0,
        maxSlots: 20,
        usedSlots: 0,
      },
    });

    // Generate JWT token
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      iat: Date.now(),
      jti: uuidv4(),
    };

    const accessToken = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...result } = user;

    return {
      user: result,
      accessToken,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      iat: Date.now(),
      jti: uuidv4(),
    };

    const accessToken = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...result } = user;

    return {
      user: result,
      accessToken,
    };
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      iat: Date.now(),
      jti: uuidv4(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
