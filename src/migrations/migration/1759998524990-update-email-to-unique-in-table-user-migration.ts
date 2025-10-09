import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class UpdateEmailToUniqueInTableUserMigration1759998524990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            "user",
            new TableIndex({
                name: "IDX_user_email_unique",
                columnNames: ["email"],
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("user", "IDX_user_email_unique");
    }

}
