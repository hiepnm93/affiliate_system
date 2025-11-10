import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(email: string, password: string, name: string): Promise<UserEntity>;
}
