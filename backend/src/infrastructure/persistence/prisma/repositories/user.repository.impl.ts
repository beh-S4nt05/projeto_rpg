import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '../../../../core/repositories/user.repository';
import { User } from '../../../../core/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return new User(
      user.id,
      user.username,
      user.name,
      user.email,
      user.password,
      user.phone,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    return new User(
      user.id,
      user.username,
      user.name,
      user.email,
      user.password,
      user.phone,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return new User(
      user.id,
      user.username,
      user.name,
      user.email,
      user.password,
      user.phone,
      user.createdAt,
      user.updatedAt,
    );
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
      },
    });

    return new User(
      createdUser.id,
      createdUser.username,
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.phone,
      createdUser.createdAt,
      createdUser.updatedAt,
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        updatedAt: user.updatedAt,
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.username,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.phone,
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return !!user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }
}
