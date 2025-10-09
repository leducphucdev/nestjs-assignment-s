import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTaskTableMigration1759984147830 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Create the task table with all required fields from ERD
      await queryRunner.createTable(
        new Table({
            name: "task",
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
                    name: "status",
                    type: "enum",
                    enum: ["TODO", "DOING", "IN REVIEW", "DONE", "DROPPED"],
                    default: "'TODO'",
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
                {
                    name: "project_id",
                    type: "uuid",
                    isNullable: true,
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: "IDX_task_status",
                    columnNames: ["status"],
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["project_id"],
                    referencedTableName: "project",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["user_id"],
                    referencedTableName: "user",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE",
                },
            ],
        }),
        true
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // Drop the task table
      await queryRunner.dropTable("task", true);
    }

}
