import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseEnumPipe,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { DeleteStatus, TaskStatus } from "src/common/types";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { FindTasksDto } from "./dtos/find-tasks.dto";
import { UpdateTaskDto } from "./dtos/update-tesk.dto";
import { Task } from "./task.entity";
import { TasksService } from "./tasks.service";

@Controller("/tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get("/:id")
	async findTaskById(@Param("id", ParseUUIDPipe) id: string): Promise<Task> {
		return this.tasksService.findById(id);
	}

	@Post("/create")
	async createTask(@Body() body: CreateTaskDto): Promise<Task> {
		return this.tasksService.createTask(body);
	}

	@Get("/user/:userId")
	async findTasks(
		@Param("userId", ParseUUIDPipe) userId: string,
		@Query() params: FindTasksDto,
	): Promise<Task[]> {
		return this.tasksService.findTasksByUserAndStatus(userId, params);
	}

	@Get("/user/:userId/count")
	async countTasks(
		@Param("userId", ParseUUIDPipe) userId: string,
		@Query("status", new ParseEnumPipe(TaskStatus)) status: TaskStatus,
	): Promise<{ count: number }> {
		return this.tasksService.countTasks(userId, status);
	}

	@Patch("/:id")
	async updateTask(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() body: UpdateTaskDto,
	): Promise<Task> {
		return this.tasksService.updateTask(id, body);
	}

	@Delete("/:id")
	async deleteTask(@Param("id", ParseUUIDPipe) id: string): Promise<DeleteStatus> {
		return this.tasksService.deleteTask(id);
	}
}
