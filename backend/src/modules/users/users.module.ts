import { Module } from '@nestjs/common';

// Controllers
import { UsersController } from './controllers/users.controller';

// Services
import { UsersService } from './services/users.service';

// Core
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
