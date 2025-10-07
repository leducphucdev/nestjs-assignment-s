import { IsUUID } from "class-validator";

export class ManageProjectUsersDto {
	@IsUUID()
	userId: string;

	@IsUUID()
	projectId: string;
}
