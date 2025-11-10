import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import ormconfig from '../ormconfig';
import { SampleWebModule } from './interfaces/web/sample_control.module';
import { AuthWebModule } from './interfaces/web/auth/auth-web.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), SampleWebModule, AuthWebModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
