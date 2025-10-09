import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../projects/project.entity";
import { Task } from "../tasks/task.entity";

@Entity({ name: "user", schema: "public" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 40, name: "first_name" })
    firstName: string;

    @Column({ length: 40, name: "last_name" })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    deletedAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @ManyToMany(() => Project, (project) => project.users, { onDelete: "CASCADE" })
    @JoinTable({
        name: "user_projects",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "project_id",
            referencedColumnName: "id",
        },
    })
    projects: Project[];
}
