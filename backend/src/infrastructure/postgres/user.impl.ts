import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domains/user/entities/user.entity';
import { UserOrmEntity } from './entities/user.orm-entity';
import { UserMapper } from './mappers/user.mapper';
import { IUserRepository } from '../../domains/user/repositories/user.repository.interface';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async create(
    email: string,
    password: string,
    name: string,
  ): Promise<UserEntity> {
    const ormEntity = this.repository.create({ email, password, name });
    const savedOrmEntity = await this.repository.save(ormEntity);
    return UserMapper.toDomain(savedOrmEntity);
  }
}
