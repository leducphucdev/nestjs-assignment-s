import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateApiKeyTableMigration1759983997173 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Create the api_key table with all required fields
      await queryRunner.createTable(
        new Table({
            name: "api_key",
            schema: "public",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "is_active",
                    type: "tinyint",
                    length: "4",
                    default: 1,
                },
                {
                    name: "created_at",
                    type: "datetime",
                    length: "6",
                    default: "CURRENT_TIMESTAMP(6)",
                },
                {
                    name: "expires_at",
                    type: "datetime",
                    length: "6",
                    isNullable: true,
                },
            ],
        }),
        true
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // Drop the api_key table
      await queryRunner.dropTable("api_key", true);
    }

}
