import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '../../core/services/user.service';
import { IUserRepository } from '../../core/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserDomainService,
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await this.userService.validatePassword(user, password);
    if (!isValid) {
      return null;
    }

    // Retornar dados do usuário sem a senha
    const { password: _, ...result } = user.toJSON();
    return result;
  }

  async login(username: string, password: string): Promise<{ access_token: string; user: any }> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      iat: Date.now(),
      jti: uuidv4(), // JWT ID
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async refreshToken(user: any): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      iat: Date.now(),
      jti: uuidv4(),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
