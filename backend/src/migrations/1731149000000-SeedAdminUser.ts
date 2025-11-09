import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1731149000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash default admin password
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Insert admin user
    await queryRunner.query(
      `
      INSERT INTO users (email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `,
      ['admin@affiliate.com', hashedPassword, 'admin'],
    );

    console.log('✅ Admin user seeded successfully');
    console.log('📧 Email: admin@affiliate.com');
    console.log('🔑 Password: Admin@123456');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove admin user
    await queryRunner.query(`DELETE FROM users WHERE email = $1`, [
      'admin@affiliate.com',
    ]);
  }
}
