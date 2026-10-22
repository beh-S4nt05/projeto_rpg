import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RaceType } from '../src/core/entities/avatar.entity';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create default races
  const races = [
    { name: 'Humano', description: 'Raça humana padrão' },
    { name: 'Anão', description: 'Raça anã, forte e resistente' },
    { name: 'Elfo', description: 'Raça élfica, ágil e inteligente' },
    { name: 'Meio-Elfo', description: 'Metade humano, metade elfo' },
    { name: 'Meio-Anão', description: 'Metade humano, metade anão' },
    { name: 'Halfling', description: 'Pequena raça, ágil e sorte' },
    { name: 'Gnomo', description: 'Pequena raça, inteligente e criativa' },
    { name: 'Meio-Orc', description: 'Metade humano, metade orc, forte e resistente' },
    { name: 'Tiefling', description: 'Raça com ancestralidade infernal' },
  ];

  for (const race of races) {
    await prisma.races.upsert({
      where: { name: race.name },
      update: {},
      create: race,
    });
  }

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'admin-id',
      username: 'admin',
      name: 'Administrador',
      email: 'admin@rpg.com',
      password: adminPassword,
      phone: '+550000000000',
    },
  });

  // Create admin avatar
  const adminAvatar = await prisma.avatar.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      id: 'admin-avatar-id',
      name: 'Admin',
      raceId: 1, // Humano
      level: 100,
      tier: 5,
      experience: 10000,
      userId: adminUser.id,
    },
  });

  // Create admin atributos
  await prisma.atributos.upsert({
    where: { avatarId: adminAvatar.id },
    update: {},
    create: {
      id: 'admin-atributos-id',
      strength: 50,
      agility: 50,
      defence: 50,
      resistance: 50,
      intelligence: 50,
      vitality: 50,
      energy_points: 500,
      attribute_points: 100,
      skill_points: 100,
      avatarId: adminAvatar.id,
    },
  });

  // Create admin inventory
  await prisma.inventory.upsert({
    where: { avatarId: adminAvatar.id },
    update: {},
    create: {
      id: 'admin-inventory-id',
      pesoMax: 1000,
      pesoActual: 0,
      avatarId: adminAvatar.id,
    },
  });

  // Create some default items
  const items = [
    { name: 'Espada de Aço', description: 'Espada básica de aço', peso: 5, quality: 'comum', itemType: 'arma' },
    { name: 'Escudo de Madeira', description: 'Escudo básico de madeira', peso: 8, quality: 'comum', itemType: 'armadura' },
    { name: 'Poção de Vida', description: 'Restaura 50 HP', peso: 1, quality: 'raro', itemType: 'pocao' },
    { name: 'Anel de Força', description: 'Aumenta força em +5', peso: 1, quality: 'epico', itemType: 'material' },
    { name: 'Armadura de Placas', description: 'Armadura pesada', peso: 20, quality: 'raro', itemType: 'armadura' },
    { name: 'Varinha Mágica', description: 'Varinha para lançar magias', peso: 3, quality: 'epico', itemType: 'arma' },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: {},
      create: {
        id: `item-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...item,
        inventoryId: 'admin-inventory-id',
      },
    });
  }

  // Create some monsters
  const monsters = [
    { name: 'Goblin', description: 'Criatura fraca, fácil de derrotar', level: 1 },
    { name: 'Orc', description: 'Criatura forte, perigosa', level: 3 },
    { name: 'Dragão', description: 'Criatura lendária, extremamente perigosa', level: 10 },
  ];

  for (const monster of monsters) {
    const createdMonster = await prisma.monster.create({
      data: {
        id: monster.level,
        name: monster.name,
        description: monster.description,
        level: monster.level,
      },
    });

    // Create atributos for monster
    await prisma.atributos.create({
      data: {
        id: `monster-${createdMonster.id}-atributos`,
        strength: monster.level * 10,
        agility: monster.level * 5,
        defence: monster.level * 5,
        resistance: monster.level * 5,
        intelligence: monster.level * 2,
        vitality: monster.level * 10,
        energy_points: monster.level * 20,
        attribute_points: 0,
        skill_points: 0,
        monsterId: createdMonster.id.toString(),
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
