import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserDomainService } from '../../core/services/user.service';
import { UserRepository } from '../../infrastructure/persistence/prisma/repositories/user.repository.impl';
import { AvatarRepository } from '../../infrastructure/persistence/prisma/repositories/avatar.repository.impl';
import { AtributosRepository } from '../../infrastructure/persistence/prisma/repositories/atributos.repository.impl';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [
    UserDomainService,
    UserRepository,
    AvatarRepository,
    AtributosRepository,
    PrismaService,
  ],
  exports: [UserDomainService, UserRepository],
})
export class UserModule {}
