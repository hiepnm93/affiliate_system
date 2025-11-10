import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(
    user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserEntity>;
  update(id: number, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: number): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
