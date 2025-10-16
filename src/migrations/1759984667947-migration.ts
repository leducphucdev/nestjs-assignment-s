import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1759984667947 implements MigrationInterface {
    name = 'Migration1759984667947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` uuid NOT NULL, \`first_name\` varchar(40) NOT NULL, \`last_name\` varchar(40) NOT NULL, \`email\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`deletedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);  
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`status\` enum ('TODO', 'DOING', 'IN REVIEW', 'DONE', 'DROPPED') NOT NULL DEFAULT 'TODO', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`projectId\` uuid NULL, \`userId\` uuid NULL, INDEX \`IDX_2fe7a278e6f08d2be55740a939\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project\` (\`id\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_key\` (\`id\` uuid NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_projects\` (\`user_id\` uuid NOT NULL, \`project_id\` uuid NOT NULL, INDEX \`IDX_86ef6061f6f13aa9252b12cbe8\` (\`user_id\`), INDEX \`IDX_4c6aaf014ba0d66a74bb552272\` (\`project_id\`), PRIMARY KEY (\`user_id\`, \`project_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_3797a20ef5553ae87af126bc2fe\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_f316d3fe53497d4d8a2957db8b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_projects\` ADD CONSTRAINT \`FK_86ef6061f6f13aa9252b12cbe87\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_projects\` ADD CONSTRAINT \`FK_4c6aaf014ba0d66a74bb5522726\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_projects\` DROP FOREIGN KEY \`FK_4c6aaf014ba0d66a74bb5522726\``);
        await queryRunner.query(`ALTER TABLE \`user_projects\` DROP FOREIGN KEY \`FK_86ef6061f6f13aa9252b12cbe87\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_f316d3fe53497d4d8a2957db8b9\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_3797a20ef5553ae87af126bc2fe\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c6aaf014ba0d66a74bb552272\` ON \`user_projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_86ef6061f6f13aa9252b12cbe8\` ON \`user_projects\``);
        await queryRunner.query(`DROP TABLE \`user_projects\``);
        await queryRunner.query(`DROP TABLE \`api_key\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`project\``);
        await queryRunner.query(`DROP INDEX \`IDX_2fe7a278e6f08d2be55740a939\` ON \`task\``);
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}
