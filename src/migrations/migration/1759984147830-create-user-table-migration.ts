import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTableMigration1759984213656 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Create the user table with all required fields from ERD
      await queryRunner.createTable(
        new Table({
            name: "user",
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
                    name: "first_name",
                    type: "varchar",
                    length: "40",
                    isNullable: false,
                },
                {
                    name: "last_name",
                    type: "varchar",
                    length: "40",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "location",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "created_at",
                    type: "datetime",
                    length: "6",
                    default: "CURRENT_TIMESTAMP(6)",
                },
                {
                    name: "deleted_at",
                    type: "datetime",
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: "IDX_user_email",
                    columnNames: ["email"],
                    isUnique: true,
                },
            ],
        }),
        true
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // Drop the user table
      await queryRunner.dropTable("user", true);
    }

}
