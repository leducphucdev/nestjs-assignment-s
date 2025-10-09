import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserProjectsTable20251007172809 implements MigrationInterface {
    name = 'CreateUserProjectsTable20251007172809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the user_projects junction table for many-to-many relationship
        await queryRunner.createTable(
            new Table({
                name: "user_projects",
                schema: "public",
                columns: [
                    {
                        name: "user_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "project_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedTableName: "user",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        columnNames: ["project_id"],
                        referencedTableName: "project",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the user_projects junction table
        await queryRunner.dropTable("user_projects", true);
    }
}
