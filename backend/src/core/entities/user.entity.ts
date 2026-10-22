import { Avatar } from './avatar.entity';

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public name: string,
    public email: string,
    public password: string,
    public phone?: string | null,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public avatar?: Avatar | null = null,
  ) {}

  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  updateProfile(data: { name?: string; email?: string; phone?: string }): void {
    this.name = data.name ?? this.name;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.updatedAt = new Date();
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
