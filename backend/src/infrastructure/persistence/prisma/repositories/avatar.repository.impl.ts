import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAvatarRepository } from '../../../../core/repositories/avatar.repository';
import { Avatar, RaceType } from '../../../../core/entities/avatar.entity';

@Injectable()
export class AvatarRepository implements IAvatarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Avatar | null> {
    const avatar = await this.prisma.avatar.findUnique({ where: { id } });
    if (!avatar) return null;

    return new Avatar(
      avatar.id,
      avatar.name,
      avatar.race as RaceType,
      avatar.level,
      avatar.tier,
      avatar.experience,
      avatar.userId,
      avatar.createdAt,
      avatar.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Avatar | null> {
    const avatar = await this.prisma.avatar.findUnique({ where: { userId } });
    if (!avatar) return null;

    return new Avatar(
      avatar.id,
      avatar.name,
      avatar.race as RaceType,
      avatar.level,
      avatar.tier,
      avatar.experience,
      avatar.userId,
      avatar.createdAt,
      avatar.updatedAt,
    );
  }

  async create(avatar: Avatar): Promise<Avatar> {
    // First, check if race exists
    let raceId = 1; // Default to Humano
    const race = await this.prisma.races.findFirst({
      where: { name: avatar.race },
    });
    
    if (race) {
      raceId = race.id;
    } else {
      // Create the race if it doesn't exist
      const newRace = await this.prisma.races.create({
        data: { name: avatar.race, description: `Raça ${avatar.race}` },
      });
      raceId = newRace.id;
    }

    const createdAvatar = await this.prisma.avatar.create({
      data: {
        id: avatar.id,
        name: avatar.name,
        raceId,
        level: avatar.level,
        tier: avatar.tier,
        experience: avatar.experience,
        userId: avatar.userId,
      },
      include: { race: true },
    });

    return new Avatar(
      createdAvatar.id,
      createdAvatar.name,
      createdAvatar.race.name as RaceType,
      createdAvatar.level,
      createdAvatar.tier,
      createdAvatar.experience,
      createdAvatar.userId,
      createdAvatar.createdAt,
      createdAvatar.updatedAt,
    );
  }

  async update(avatar: Avatar): Promise<Avatar> {
    const updatedAvatar = await this.prisma.avatar.update({
      where: { id: avatar.id },
      data: {
        name: avatar.name,
        level: avatar.level,
        tier: avatar.tier,
        experience: avatar.experience,
        updatedAt: avatar.updatedAt,
      },
      include: { race: true },
    });

    return new Avatar(
      updatedAvatar.id,
      updatedAvatar.name,
      updatedAvatar.race.name as RaceType,
      updatedAvatar.level,
      updatedAvatar.tier,
      updatedAvatar.experience,
      updatedAvatar.userId,
      updatedAvatar.createdAt,
      updatedAvatar.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.avatar.delete({ where: { id } });
  }
}
