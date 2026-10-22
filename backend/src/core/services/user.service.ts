import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository';
import { IAvatarRepository } from '../repositories/avatar.repository';
import { IAtributosRepository } from '../repositories/atributos.repository';
import { User } from '../entities/user.entity';
import { Avatar, RaceType } from '../entities/avatar.entity';
import { Atributos } from '../entities/atributos.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserDomainService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly avatarRepository: IAvatarRepository,
    private readonly atributosRepository: IAtributosRepository,
  ) {}

  async registerUser(
    username: string,
    name: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<User> {
    // Verificar se usuário já existe
    const usernameExists = await this.userRepository.existsByUsername(username);
    if (usernameExists) {
      throw new Error('Username already exists');
    }

    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = new User(
      uuidv4(),
      username,
      name,
      email,
      hashedPassword,
      phone,
    );

    const createdUser = await this.userRepository.create(user);

    // Criar avatar padrão
    const avatar = new Avatar(
      uuidv4(),
      username,
      RaceType.HUMAN, // Raça padrão
      1,
      1,
      0,
      createdUser.id,
    );

    await this.avatarRepository.create(avatar);

    // Criar atributos padrão
    const atributos = new Atributos(
      uuidv4(),
      10, // strength
      10, // agility
      10, // defence
      10, // resistance
      10, // intelligence
      10, // vitality
      100, // energyPoints
      5, // attributePoints
      5, // skillPoints
      avatar.id,
    );

    await this.atributosRepository.create(atributos);

    return createdUser;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
