import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domains/user/repositories/user.repository.interface';
import { UserEntity } from '../../../domains/user/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: number): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async create(
    user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserEntity> {
    const ormEntity = this.repository.create(user as any);
    const savedEntity = (await this.repository.save(ormEntity)) as any;
    return UserMapper.toDomain(savedEntity);
  }

  async update(
    id: number,
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    await this.repository.update(id, UserMapper.toOrmPartial(user));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
