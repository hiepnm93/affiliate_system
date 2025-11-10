import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCampaignCommissionTables1731148000000
  implements MigrationInterface
{
  name = 'CreateCampaignCommissionTables1731148000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create campaigns table
    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "rewardType" character varying NOT NULL,
        "rewardValue" decimal(10,2) NOT NULL,
        "multiLevelConfig" jsonb NOT NULL,
        "cookieTTL" integer NOT NULL DEFAULT 30,
        "status" character varying NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaigns_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_campaigns_startDate" ON "campaigns" ("startDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campaigns_endDate" ON "campaigns" ("endDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campaigns_status" ON "campaigns" ("status")`,
    );

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" SERIAL NOT NULL,
        "referredUserId" integer NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'USD',
        "status" character varying NOT NULL DEFAULT 'pending',
        "externalId" character varying NOT NULL,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_transactions_externalId" UNIQUE ("externalId"),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_referredUserId" ON "transactions" ("referredUserId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_status" ON "transactions" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_createdAt" ON "transactions" ("createdAt")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_transactions_externalId" ON "transactions" ("externalId")`,
    );
    await queryRunner.query(`
      ALTER TABLE "transactions"
      ADD CONSTRAINT "FK_transactions_referredUserId"
      FOREIGN KEY ("referredUserId")
      REFERENCES "referred_users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Create commissions table
    await queryRunner.query(`
      CREATE TABLE "commissions" (
        "id" SERIAL NOT NULL,
        "affiliateId" integer NOT NULL,
        "transactionId" integer NOT NULL,
        "campaignId" integer NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "level" integer NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "notes" text,
        "payoutId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_commissions_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_affiliateId" ON "commissions" ("affiliateId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_status" ON "commissions" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_transactionId" ON "commissions" ("transactionId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_composite" ON "commissions" ("affiliateId", "status")`,
    );
    await queryRunner.query(`
      ALTER TABLE "commissions"
      ADD CONSTRAINT "FK_commissions_affiliateId"
      FOREIGN KEY ("affiliateId")
      REFERENCES "affiliates"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "commissions"
      ADD CONSTRAINT "FK_commissions_transactionId"
      FOREIGN KEY ("transactionId")
      REFERENCES "transactions"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "commissions"
      ADD CONSTRAINT "FK_commissions_campaignId"
      FOREIGN KEY ("campaignId")
      REFERENCES "campaigns"("id")
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop commissions table
    await queryRunner.query(
      `ALTER TABLE "commissions" DROP CONSTRAINT "FK_commissions_campaignId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commissions" DROP CONSTRAINT "FK_commissions_transactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commissions" DROP CONSTRAINT "FK_commissions_affiliateId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_commissions_composite"`);
    await queryRunner.query(`DROP INDEX "IDX_commissions_transactionId"`);
    await queryRunner.query(`DROP INDEX "IDX_commissions_status"`);
    await queryRunner.query(`DROP INDEX "IDX_commissions_affiliateId"`);
    await queryRunner.query(`DROP TABLE "commissions"`);

    // Drop transactions table
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_referredUserId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_transactions_externalId"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_status"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_referredUserId"`);
    await queryRunner.query(`DROP TABLE "transactions"`);

    // Drop campaigns table
    await queryRunner.query(`DROP INDEX "IDX_campaigns_status"`);
    await queryRunner.query(`DROP INDEX "IDX_campaigns_endDate"`);
    await queryRunner.query(`DROP INDEX "IDX_campaigns_startDate"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
  }
}
