import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Task } from "../tasks/task.entity";
import { User } from "../users/user.entity";

@Entity({ name: "project", schema: "public" })
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ type: "text" })
    description: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => Task, (task) => task.project)
    tasks: Task[];

    @ManyToMany(() => User, (user) => user.projects, { onDelete: "CASCADE" })
    users: User[];
}
