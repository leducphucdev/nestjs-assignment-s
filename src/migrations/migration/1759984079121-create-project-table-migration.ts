import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProjectTableMigration1759984079121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       // Create the project table with all required fields from ERD
       await queryRunner.createTable(
        new Table({
            name: "project",
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
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "created_at",
                    type: "datetime",
                    length: "6",
                    default: "CURRENT_TIMESTAMP(6)",
                },
                {
                    name: "updated_at",
                    type: "datetime",
                    length: "6",
                    default: "CURRENT_TIMESTAMP(6)",
                    onUpdate: "CURRENT_TIMESTAMP(6)",
                },
            ],
        }),
        true
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // Drop the project table
      await queryRunner.dropTable("project", true);
    }

}
