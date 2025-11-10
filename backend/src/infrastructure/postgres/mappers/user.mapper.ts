import { UserEntity } from '../../../domains/user/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): UserEntity {
    return new UserEntity(
      ormEntity.id,
      ormEntity.email,
      ormEntity.password,
      ormEntity.name,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: UserEntity): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.email = domainEntity.email;
    ormEntity.password = domainEntity.password;
    ormEntity.name = domainEntity.name;
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
    if (domainEntity.name !== undefined) ormEntity.name = domainEntity.name;
    return ormEntity;
  }
}
