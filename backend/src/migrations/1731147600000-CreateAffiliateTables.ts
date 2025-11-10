import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAffiliateTables1731147600000 implements MigrationInterface {
  name = 'CreateAffiliateTables1731147600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );

    // Create affiliates table
    await queryRunner.query(`
      CREATE TABLE "affiliates" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "referralCode" character varying NOT NULL,
        "parentAffiliateId" integer,
        "tier" integer NOT NULL DEFAULT 1,
        "status" character varying NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_affiliates_userId" UNIQUE ("userId"),
        CONSTRAINT "UQ_affiliates_referralCode" UNIQUE ("referralCode"),
        CONSTRAINT "PK_affiliates_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_affiliates_userId" ON "affiliates" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_affiliates_referralCode" ON "affiliates" ("referralCode")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_affiliates_status" ON "affiliates" ("status")`,
    );
    await queryRunner.query(`
      ALTER TABLE "affiliates"
      ADD CONSTRAINT "FK_affiliates_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "affiliates"
      ADD CONSTRAINT "FK_affiliates_parentAffiliateId"
      FOREIGN KEY ("parentAffiliateId")
      REFERENCES "affiliates"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    // Create referred_users table
    await queryRunner.query(`
      CREATE TABLE "referred_users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "userId" integer,
        "referralCode" character varying NOT NULL,
        "affiliateId" integer NOT NULL,
        "cookieId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_referred_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_referred_users_email" ON "referred_users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_referred_users_referralCode" ON "referred_users" ("referralCode")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_referred_users_affiliateId" ON "referred_users" ("affiliateId")`,
    );
    await queryRunner.query(`
      ALTER TABLE "referred_users"
      ADD CONSTRAINT "FK_referred_users_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "referred_users"
      ADD CONSTRAINT "FK_referred_users_affiliateId"
      FOREIGN KEY ("affiliateId")
      REFERENCES "affiliates"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Create referral_events table
    await queryRunner.query(`
      CREATE TABLE "referral_events" (
        "id" SERIAL NOT NULL,
        "affiliateId" integer NOT NULL,
        "referredUserId" integer,
        "eventType" character varying NOT NULL,
        "ipAddress" character varying NOT NULL,
        "userAgent" text NOT NULL,
        "cookieId" character varying,
        "referrer" text,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_referral_events_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_referral_events_affiliateId" ON "referral_events" ("affiliateId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_referral_events_eventType" ON "referral_events" ("eventType")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_referral_events_timestamp" ON "referral_events" ("timestamp")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_referral_events_composite" ON "referral_events" ("affiliateId", "eventType", "timestamp")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_referral_events_ip_timestamp" ON "referral_events" ("ipAddress", "timestamp")`,
    );
    await queryRunner.query(`
      ALTER TABLE "referral_events"
      ADD CONSTRAINT "FK_referral_events_affiliateId"
      FOREIGN KEY ("affiliateId")
      REFERENCES "affiliates"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "referral_events"
      ADD CONSTRAINT "FK_referral_events_referredUserId"
      FOREIGN KEY ("referredUserId")
      REFERENCES "referred_users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop referral_events table
    await queryRunner.query(
      `ALTER TABLE "referral_events" DROP CONSTRAINT "FK_referral_events_referredUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_events" DROP CONSTRAINT "FK_referral_events_affiliateId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_referral_events_ip_timestamp"`);
    await queryRunner.query(`DROP INDEX "IDX_referral_events_composite"`);
    await queryRunner.query(`DROP INDEX "IDX_referral_events_timestamp"`);
    await queryRunner.query(`DROP INDEX "IDX_referral_events_eventType"`);
    await queryRunner.query(`DROP INDEX "IDX_referral_events_affiliateId"`);
    await queryRunner.query(`DROP TABLE "referral_events"`);

    // Drop referred_users table
    await queryRunner.query(
      `ALTER TABLE "referred_users" DROP CONSTRAINT "FK_referred_users_affiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referred_users" DROP CONSTRAINT "FK_referred_users_userId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_referred_users_affiliateId"`);
    await queryRunner.query(`DROP INDEX "IDX_referred_users_referralCode"`);
    await queryRunner.query(`DROP INDEX "IDX_referred_users_email"`);
    await queryRunner.query(`DROP TABLE "referred_users"`);

    // Drop affiliates table
    await queryRunner.query(
      `ALTER TABLE "affiliates" DROP CONSTRAINT "FK_affiliates_parentAffiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliates" DROP CONSTRAINT "FK_affiliates_userId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_affiliates_status"`);
    await queryRunner.query(`DROP INDEX "IDX_affiliates_referralCode"`);
    await queryRunner.query(`DROP INDEX "IDX_affiliates_userId"`);
    await queryRunner.query(`DROP TABLE "affiliates"`);

    // Drop users table
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
