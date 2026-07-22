import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBetterAuth1784709400746 implements MigrationInterface {
    name = 'AddBetterAuth1784709400746';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "verification" ("id" text NOT NULL, "identifier" text NOT NULL, "value" text NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier") `);
        await queryRunner.query(
            `CREATE TABLE "user" ("id" text NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "image" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "session" ("id" text NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "ipAddress" text, "userAgent" text, "userId" text NOT NULL, CONSTRAINT "UQ_232f8e85d7633bd6ddfad421696" UNIQUE ("token"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "session_userId_idx" ON "session" ("userId") `);
        await queryRunner.query(
            `CREATE TABLE "account" ("id" text NOT NULL, "accountId" text NOT NULL, "providerId" text NOT NULL, "userId" text NOT NULL, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE, "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE, "scope" text, "password" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "account_userId_idx" ON "account" ("userId") `);
        await queryRunner.query(
            `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`DROP INDEX "public"."account_userId_idx"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."session_userId_idx"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."verification_identifier_idx"`);
        await queryRunner.query(`DROP TABLE "verification"`);
    }
}
