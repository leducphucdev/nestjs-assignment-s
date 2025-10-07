import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { TaskStatus } from "src/common/types";

export class FindTasksDto {
	@IsEnum(TaskStatus)
	status: TaskStatus;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	page?: number;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	pageSize?: number;
}
