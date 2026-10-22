import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAtributosRepository } from '../../../../core/repositories/atributos.repository';
import { Atributos } from '../../../../core/entities/atributos.entity';

@Injectable()
export class AtributosRepository implements IAtributosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Atributos | null> {
    const atributos = await this.prisma.atributos.findUnique({ where: { id } });
    if (!atributos) return null;

    return new Atributos(
      atributos.id,
      atributos.strength,
      atributos.agility,
      atributos.defence,
      atributos.resistance,
      atributos.intelligence,
      atributos.vitality,
      atributos.energy_points,
      atributos.attribute_points,
      atributos.skill_points,
      atributos.avatarId,
      atributos.createdAt,
      atributos.updatedAt,
    );
  }

  async findByAvatarId(avatarId: string): Promise<Atributos | null> {
    const atributos = await this.prisma.atributos.findUnique({ where: { avatarId } });
    if (!atributos) return null;

    return new Atributos(
      atributos.id,
      atributos.strength,
      atributos.agility,
      atributos.defence,
      atributos.resistance,
      atributos.intelligence,
      atributos.vitality,
      atributos.energy_points,
      atributos.attribute_points,
      atributos.skill_points,
      atributos.avatarId,
      atributos.createdAt,
      atributos.updatedAt,
    );
  }

  async create(atributos: Atributos): Promise<Atributos> {
    const createdAtributos = await this.prisma.atributos.create({
      data: {
        id: atributos.id,
        strength: atributos.strength,
        agility: atributos.agility,
        defence: atributos.defence,
        resistance: atributos.resistance,
        intelligence: atributos.intelligence,
        vitality: atributos.vitality,
        energy_points: atributos.energyPoints,
        attribute_points: atributos.attributePoints,
        skill_points: atributos.skillPoints,
        avatarId: atributos.avatarId,
      },
    });

    return new Atributos(
      createdAtributos.id,
      createdAtributos.strength,
      createdAtributos.agility,
      createdAtributos.defence,
      createdAtributos.resistance,
      createdAtributos.intelligence,
      createdAtributos.vitality,
      createdAtributos.energy_points,
      createdAtributos.attribute_points,
      createdAtributos.skill_points,
      createdAtributos.avatarId,
      createdAtributos.createdAt,
      createdAtributos.updatedAt,
    );
  }

  async update(atributos: Atributos): Promise<Atributos> {
    const updatedAtributos = await this.prisma.atributos.update({
      where: { id: atributos.id },
      data: {
        strength: atributos.strength,
        agility: atributos.agility,
        defence: atributos.defence,
        resistance: atributos.resistance,
        intelligence: atributos.intelligence,
        vitality: atributos.vitality,
        energy_points: atributos.energyPoints,
        attribute_points: atributos.attributePoints,
        skill_points: atributos.skillPoints,
        updatedAt: atributos.updatedAt,
      },
    });

    return new Atributos(
      updatedAtributos.id,
      updatedAtributos.strength,
      updatedAtributos.agility,
      updatedAtributos.defence,
      updatedAtributos.resistance,
      updatedAtributos.intelligence,
      updatedAtributos.vitality,
      updatedAtributos.energy_points,
      updatedAtributos.attribute_points,
      updatedAtributos.skill_points,
      updatedAtributos.avatarId,
      updatedAtributos.createdAt,
      updatedAtributos.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.atributos.delete({ where: { id } });
  }
}
