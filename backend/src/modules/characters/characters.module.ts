import { Module } from '@nestjs/common';

// Controllers
import { CharactersController } from './controllers/characters.controller';

// Services
import { CharactersService } from './services/characters.service';

// Core
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, PrismaService],
  exports: [CharactersService],
})
export class CharactersModule {}
