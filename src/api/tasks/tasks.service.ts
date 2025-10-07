import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { omit } from "lodash";
import { DbUtilsService } from "src/common/services/db-utils.service";
import { DeleteStatus, TaskStatus } from "src/common/types";
import { Repository } from "typeorm";
import { ProjectsService } from "../projects/projects.service";
import { UsersService } from "../users/users.service";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { FindTasksDto } from "./dtos/find-tasks.dto";
import { UpdateTaskDto } from "./dtos/update-tesk.dto";
import { Task } from "./task.entity";

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task) private taskRepository: Repository<Task>,
		private usersService: UsersService,
		private projectsService: ProjectsService,
		private dbUtilsService: DbUtilsService,
	) {}

	/**
	 * Calculates the offset needed for pagination
	 *
	 * @param pageSize - Number of items to display per page
	 * @param page - Current page number (starting from 1)
	 * @returns offset (skip)
	 */
	private calculateSkip(pageSize, page): number {
		return (page - 1) * pageSize;
	}

	/**
	 * Retrieves a task by its UUID from the database
	 *
	 * @param id - The unique UUID of the task
	 * @param loadUser - If we want to also return the associated user
	 * @param loadProject - If we want to also return the associated project
	 * @returns Promise that resolves to the found Task entity
	 * @throws {NotFoundException} - If no task is found with the given UUID
	 */
	async findById(id: string, loadUser = false, loadProject = false): Promise<Task> {
		const task = await this.dbUtilsService.executeSafely(() =>
			this.taskRepository.findOne({
				where: { id },
				relations: { user: loadUser, project: loadProject },
			}),
		);

		if (!task) throw new NotFoundException("Task does not exist");
		return task;
	}

	/**
	 * Retrieves a specific task based on the user UUID and task status from the database
	 *
	 * @param userId - The unique UUID of the user
	 * @param status - The completion status of the task
	 * @param page - The offset from which entities are taken (default 1)
	 * @param pageSize - The number of entities returned (default 10)
	 * @returns Promise that resolves to the found Task entity
	 */
	async findTasksByUserAndStatus(userId: string, params?: FindTasksDto): Promise<Task[]> {
		const page = params?.page || 1;
		const pageSize = params?.pageSize || 10;

		await this.usersService.findById(userId);
		const skip = this.calculateSkip(pageSize, page);

		return this.dbUtilsService.executeSafely(() =>
			this.taskRepository.find({
				where: {
					user: { id: userId },
					status: params?.status,
				},
				relations: { project: true },
				select: {
					id: true,
					name: true,
					description: true,
					status: true,
					createdAt: true,
					project: { id: true, name: true },
				},
				order: { createdAt: "DESC" },
				take: pageSize,
				skip,
			}),
		);
	}

	/**
	 * Retrieves the amount of tasks assigned to a user based on the status
	 *
	 * @param payload - Object containing the user UUID and task status
	 * @returns Promise that resolves to the number of tasks
	 */
	async countTasks(userId: string, status: TaskStatus): Promise<{ count: number }> {
		await this.usersService.findById(userId);

		const count = await this.dbUtilsService.executeSafely(() =>
			this.taskRepository.count({
				where: { user: { id: userId }, status },
			}),
		);

		return { count };
	}

	/**
	 * Creates a new task and saves it to the database
	 *
	 * @param payload - The required information to create a task, and the associated user UUID and project UUID
	 * @returns Promise that resolves to the created Task entity
	 */
	async createTask(payload: CreateTaskDto): Promise<Task> {
		const task = this.taskRepository.create({
			name: payload.name,
			description: payload.description,
			status: payload.status,
		});

		task.user = await this.usersService.findById(payload.userId);
		task.project = await this.projectsService.findById(payload.projectId);

		return this.dbUtilsService.executeSafely(() => this.taskRepository.save(task));
	}

	/**
	 * Updates a specific task with the new given attributes
	 *
	 * @param id - The unique UUID of the task
	 * @param attrs - Attributes of the Task entity to update, with optional user and project UUIDs
	 * @returns Promise that resolves to the updated Task entity
	 */
	async updateTask(id: string, attrs: UpdateTaskDto): Promise<Task> {
		const task = await this.findById(id);

		if (attrs.userId) {
			task.user = await this.usersService.findById(attrs.userId);
			attrs = omit(attrs, "userId");
		}

		if (attrs.projectId) {
			task.project = await this.projectsService.findById(attrs.projectId);
			attrs = omit(attrs, "projectId");
		}

		return this.dbUtilsService.executeSafely(() =>
			this.taskRepository.save({ ...task, ...attrs }),
		);
	}

	/**
	 * Deletes a task by its UUID from the database
	 *
	 * @param id - The unique UUID of the task
	 * @returns Promise that resolves to the DeleteStatus type
	 */
	async deleteTask(id: string): Promise<DeleteStatus> {
		const task = await this.findById(id);

		await this.dbUtilsService.executeSafely(() => this.taskRepository.remove(task));

		return { deleted: true, message: "Task deleted sucessfully" };
	}
}
