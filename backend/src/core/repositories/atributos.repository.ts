import { Atributos } from '../entities/atributos.entity';

export interface IAtributosRepository {
  findById(id: string): Promise<Atributos | null>;
  findByAvatarId(avatarId: string): Promise<Atributos | null>;
  create(atributos: Atributos): Promise<Atributos>;
  update(atributos: Atributos): Promise<Atributos>;
  delete(id: string): Promise<void>;
}
