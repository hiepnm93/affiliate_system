import { UserEntity } from '../../../domains/user/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): UserEntity {
    return new UserEntity(
      ormEntity.id,
      ormEntity.email,
      ormEntity.password,
      ormEntity.role,
      ormEntity.isActive,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: UserEntity): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.email = domainEntity.email;
    ormEntity.password = domainEntity.password;
    ormEntity.role = domainEntity.role;
    ormEntity.isActive = domainEntity.isActive;
    if (domainEntity.createdAt) {
      ormEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      ormEntity.updatedAt = domainEntity.updatedAt;
    }
    return ormEntity;
  }

  static toOrmPartial(
    domainEntity: Partial<UserEntity>,
  ): Partial<UserOrmEntity> {
    const ormEntity: Partial<UserOrmEntity> = {};
    if (domainEntity.id !== undefined) ormEntity.id = domainEntity.id;
    if (domainEntity.email !== undefined) ormEntity.email = domainEntity.email;
    if (domainEntity.password !== undefined)
      ormEntity.password = domainEntity.password;
    if (domainEntity.role !== undefined) ormEntity.role = domainEntity.role;
    if (domainEntity.isActive !== undefined)
      ormEntity.isActive = domainEntity.isActive;
    if (domainEntity.createdAt !== undefined)
      ormEntity.createdAt = domainEntity.createdAt;
    if (domainEntity.updatedAt !== undefined)
      ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
