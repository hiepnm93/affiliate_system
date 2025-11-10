import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.orm-entity';
import { UserRepositoryImpl } from './user.impl';
import { USER_REPOSITORY_TOKEN } from '../../domains/user/repositories/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserImplModule {}
