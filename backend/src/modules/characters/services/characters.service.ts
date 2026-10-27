import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get avatar by user ID
   */
  async getAvatarByUserId(userId: string) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { userId },
      include: {
        race: true,
        characterClass: true,
        attributes: true,
        inventory: true,
      },
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    return avatar;
  }

  /**
   * Get avatar by ID
   */
  async getAvatarById(id: string) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
      include: {
        race: true,
        characterClass: true,
        attributes: true,
        inventory: true,
        equipment: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    return avatar;
  }

  /**
   * Update avatar
   */
  async updateAvatar(id: string, data: any) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    return this.prisma.avatar.update({
      where: { id },
      data,
    });
  }

  /**
   * Level up avatar
   */
  async levelUp(id: string) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
      include: { attributes: true },
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    // Check if avatar has enough experience
    if (avatar.experience < avatar.experienceToNextLevel) {
      throw new Error('Not enough experience to level up');
    }

    // Calculate new level and experience
    const newLevel = avatar.level + 1;
    const newExperience = avatar.experience - avatar.experienceToNextLevel;
    const newExperienceToNextLevel = Math.floor(avatar.experienceToNextLevel * 1.5);

    // Update avatar
    const updatedAvatar = await this.prisma.avatar.update({
      where: { id },
      data: {
        level: newLevel,
        experience: newExperience,
        experienceToNextLevel: newExperienceToNextLevel,
      },
    });

    // Add attribute points (5 per level)
    await this.prisma.attributes.update({
      where: { avatarId: id },
      data: {
        attributePoints: {
          increment: 5,
        },
      },
    });

    return updatedAvatar;
  }

  /**
   * Gain experience
   */
  async gainExperience(id: string, amount: number) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
      include: { attributes: true },
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    // Calculate new experience
    const newExperience = avatar.experience + amount;
    let levelUpCount = 0;
    let currentExperience = newExperience;
    let currentLevel = avatar.level;
    let currentExperienceToNextLevel = avatar.experienceToNextLevel;

    // Check for level ups
    while (currentExperience >= currentExperienceToNextLevel) {
      levelUpCount++;
      currentExperience -= currentExperienceToNextLevel;
      currentLevel++;
      currentExperienceToNextLevel = Math.floor(currentExperienceToNextLevel * 1.5);
    }

    // Update avatar
    const updatedAvatar = await this.prisma.avatar.update({
      where: { id },
      data: {
        level: currentLevel,
        experience: currentExperience,
        experienceToNextLevel: currentExperienceToNextLevel,
      },
    });

    // Add attribute points (5 per level up)
    if (levelUpCount > 0) {
      await this.prisma.attributes.update({
        where: { avatarId: id },
        data: {
          attributePoints: {
            increment: 5 * levelUpCount,
          },
        },
      });
    }

    return {
      avatar: updatedAvatar,
      leveledUp: levelUpCount > 0,
      levelsGained: levelUpCount,
    };
  }

  /**
   * Update attributes
   */
  async updateAttributes(avatarId: string, data: any) {
    const attributes = await this.prisma.attributes.findUnique({
      where: { avatarId },
    });

    if (!attributes) {
      throw new NotFoundException('Attributes not found');
    }

    // Check if user has enough attribute points
    const totalPointsToSpend = Object.keys(data)
      .filter(key => key !== 'id' && key !== 'avatarId' && key !== 'createdAt' && key !== 'updatedAt')
      .reduce((sum, key) => {
        const value = data[key];
        if (value !== undefined && value !== null) {
          return sum + Math.abs(value - attributes[key as keyof typeof attributes]);
        }
        return sum;
      }, 0);

    const currentPoints = attributes.attributePoints || 0;
    
    if (totalPointsToSpend > currentPoints) {
      throw new Error('Not enough attribute points');
    }

    // Update attributes
    return this.prisma.attributes.update({
      where: { avatarId },
      data: {
        ...data,
        attributePoints: currentPoints - totalPointsToSpend,
      },
    });
  }

  /**
   * Get all races
   */
  async getAllRaces() {
    return this.prisma.race.findMany();
  }

  /**
   * Get all character classes
   */
  async getAllClasses() {
    return this.prisma.characterClass.findMany();
  }

  /**
   * Create avatar (for new users)
   */
  async createAvatar(userId: string, data: any) {
    return this.prisma.avatar.create({
      data: {
        id: data.id || undefined,
        name: data.name,
        userId,
        raceId: data.raceId,
        classId: data.classId || null,
        level: data.level || 1,
        experience: data.experience || 0,
        experienceToNextLevel: data.experienceToNextLevel || 100,
      },
    });
  }
}
