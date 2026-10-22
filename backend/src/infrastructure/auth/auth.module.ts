import { Module } from '@nestjs/common';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt/jwt.module';
import { UserDomainService } from '../../core/services/user.service';
import { UserRepository } from '../../infrastructure/persistence/prisma/repositories/user.repository.impl';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, UserDomainService, UserRepository, PrismaService],
  exports: [AuthService, JwtAuthModule],
})
export class AuthModule {}
