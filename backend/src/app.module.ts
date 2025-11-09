import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import ormconfig from '../ormconfig';

// Feature Modules
import { AuthModule } from './interfaces/web/auth/auth.module';
import { AffiliateModule } from './interfaces/web/affiliate/affiliate.module';
import { AdminModule } from './interfaces/web/admin/admin.module';
import { WebhookModule } from './interfaces/web/webhook/webhook.module';

// Sample Module (can be removed later)
import { SampleWebModule } from './interfaces/web/sample_control.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    AffiliateModule,
    AdminModule,
    WebhookModule,
    SampleWebModule, // Keep for now
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
