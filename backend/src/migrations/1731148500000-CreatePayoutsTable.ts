import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreatePayoutsTable1731148500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create payouts table
    await queryRunner.createTable(
      new Table({
        name: 'payouts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'affiliate_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'payment_method',
            type: 'enum',
            enum: ['bank_transfer', 'e_wallet', 'paypal', 'crypto'],
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'processing', 'paid', 'failed', 'cancelled'],
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'requested_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'admin_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'payment_details',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'failure_reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'payouts',
      new TableIndex({
        name: 'IDX_PAYOUTS_AFFILIATE_ID',
        columnNames: ['affiliate_id'],
      }),
    );

    await queryRunner.createIndex(
      'payouts',
      new TableIndex({
        name: 'IDX_PAYOUTS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'payouts',
      new TableIndex({
        name: 'IDX_PAYOUTS_AFFILIATE_STATUS',
        columnNames: ['affiliate_id', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'payouts',
      new TableIndex({
        name: 'IDX_PAYOUTS_STATUS_REQUESTED_AT',
        columnNames: ['status', 'requested_at'],
      }),
    );

    // Create foreign key to affiliates table
    await queryRunner.createForeignKey(
      'payouts',
      new TableForeignKey({
        columnNames: ['affiliate_id'],
        referencedTableName: 'affiliates',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key index on commissions table (payoutId column)
    await queryRunner.createIndex(
      'commissions',
      new TableIndex({
        name: 'IDX_COMMISSIONS_PAYOUT_ID',
        columnNames: ['payoutId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key and indexes from commissions table
    await queryRunner.dropIndex('commissions', 'IDX_COMMISSIONS_PAYOUT_ID');

    // Drop table (foreign keys and indexes will be dropped automatically)
    await queryRunner.dropTable('payouts');
  }
}
