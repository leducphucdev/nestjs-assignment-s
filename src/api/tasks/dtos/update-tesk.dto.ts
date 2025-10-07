import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskStatus } from "src/common/types";

export class UpdateTaskDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;

	@IsOptional()
	@IsUUID()
	userId?: string;

	@IsOptional()
	@IsUUID()
	projectId?: string;
}
