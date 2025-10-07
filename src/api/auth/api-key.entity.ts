import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "api_key", schema: "public" })
export class ApiKey {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: true, name: "is_active" })
    isActive: boolean;
}
