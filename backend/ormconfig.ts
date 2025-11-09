import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load .env file manually (ormconfig runs before ConfigModule)
dotenv.config({ path: join(__dirname, '..', '.env') });

const isTestEnv = process.env.NODE_ENV === 'test';

const entitiesGlob = join(
  __dirname,
  'src',
  '**',
  '*.{entity,orm-entity}.{ts,js}',
);

const migrationsGlob = join(__dirname, 'src', 'migrations', '*.{ts,js}');

// Debug: Log environment variables
console.log('📝 Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_USERNAME:', process.env.DB_USERNAME);
console.log('  POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : undefined);
console.log(
  '  POSTGRES_PASSWORD:',
  process.env.POSTGRES_PASSWORD ? '***' : undefined,
);
console.log('  DB_NAME:', process.env.DB_NAME);
console.log('  POSTGRES_DB:', process.env.POSTGRES_DB);

const config: TypeOrmModuleOptions = isTestEnv
  ? {
      // Test environment - SQLite in memory
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [entitiesGlob],
      synchronize: true,
      logging: false,
    }
  : {
      // Production & Development - Simple PostgreSQL
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || process.env.POSTGRES_USER,
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
      database: process.env.DB_NAME || process.env.POSTGRES_DB,
      entities: [entitiesGlob],
      migrations: [migrationsGlob],
      synchronize: process.env.DB_SYNCRONIZE === 'true',
      migrationsRun: true,
      logging: process.env.NODE_ENV !== 'production',
    };

console.log('🔧 Database Config:', {
  host: config.type === 'postgres' ? config['host'] : 'sqlite',
  database: config.type === 'postgres' ? config['database'] : ':memory:',
});

export default config;
