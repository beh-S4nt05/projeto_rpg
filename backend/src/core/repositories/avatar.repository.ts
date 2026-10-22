import { Avatar } from '../entities/avatar.entity';

export interface IAvatarRepository {
  findById(id: string): Promise<Avatar | null>;
  findByUserId(userId: string): Promise<Avatar | null>;
  create(avatar: Avatar): Promise<Avatar>;
  update(avatar: Avatar): Promise<Avatar>;
  delete(id: string): Promise<void>;
}
