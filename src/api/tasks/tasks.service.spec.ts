import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";
import { config } from "src/config/data-source.config";
import { TaskStatus } from "src/common/types";
import { DataSource, DataSourceOptions } from "typeorm";
import { AuthModule } from "../auth/auth.module";
import { ProjectsModule } from "../projects/projects.module";
import { ProjectsService } from "../projects/projects.service";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { FindTasksDto } from "./dtos/find-tasks.dto";
import { UpdateTaskDto } from "./dtos/update-tesk.dto";
import { Task } from "./task.entity";
import { TasksService } from "./tasks.service";

describe("Tasks service", () => {
	let tasksService: TasksService;
	let usersService: UsersService;
	let projectsService: ProjectsService;
	let dataSource: DataSource;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(config as unknown as DataSourceOptions),
				TypeOrmModule.forFeature([Task]),
				AuthModule,
				UsersModule,
				ProjectsModule,
				CommonModule,
			],
			providers: [TasksService],
		}).compile();

		dataSource = module.get<DataSource>(DataSource);
		await dataSource.synchronize(true);

		tasksService = module.get<TasksService>(TasksService);
		usersService = module.get<UsersService>(UsersService);
		projectsService = module.get<ProjectsService>(ProjectsService);
	});

	it("should be defined", () => {
		expect(tasksService).toBeDefined();
	});

	it("should create a task", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const task = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		expect(task).toBeDefined();
		expect(task.name).toEqual("test task");
		expect(task.description).toEqual("test task description");
		expect(task.status).toEqual(TaskStatus.TODO);
		expect(task.user.id).toEqual(user.id);
		expect(task.project.id).toEqual(project.id);
		expect(task.createdAt).toBeDefined();
		expect(task.updatedAt).toBeDefined();
	});

	it("should throw if trying to create a task with non-existent user", async () => {
		const project = await projectsService.createProject("test project", "test description");

		const createTaskDto: CreateTaskDto = {
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: "non-existent-user-id",
			projectId: project.id,
		};

		expect(tasksService.createTask(createTaskDto)).rejects.toThrow(NotFoundException);
	});

	it("should throw if trying to create a task with non-existent project", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const createTaskDto: CreateTaskDto = {
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: "non-existent-project-id",
		};

		expect(tasksService.createTask(createTaskDto)).rejects.toThrow(NotFoundException);
	});

	it("should find a task by id", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		const foundTask = await tasksService.findById(createdTask.id);

		expect(foundTask).toBeDefined();
		expect(foundTask.id).toEqual(createdTask.id);
		expect(foundTask.name).toEqual("test task");
		expect(foundTask.description).toEqual("test task description");
		expect(foundTask.status).toEqual(TaskStatus.TODO);
	});

	it("should find a task by id with user relation", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		const foundTask = await tasksService.findById(createdTask.id, true);

		expect(foundTask).toBeDefined();
		expect(foundTask.id).toEqual(createdTask.id);
		expect(foundTask.user).toBeDefined();
		expect(foundTask.user.id).toEqual(user.id);
		expect(foundTask.user.firstName).toEqual("test");
		expect(foundTask.user.lastName).toEqual("test");
		expect(foundTask.user.email).toEqual("test@test.com");
	});

	it("should find a task by id with project relation", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		const foundTask = await tasksService.findById(createdTask.id, false, true);

		expect(foundTask).toBeDefined();
		expect(foundTask.id).toEqual(createdTask.id);
		expect(foundTask.project).toBeDefined();
		expect(foundTask.project.id).toEqual(project.id);
		expect(foundTask.project.name).toEqual("test project");
		expect(foundTask.project.description).toEqual("test description");
	});

	it("should throw if trying to find a task that doesn't exist", async () => {
		expect(tasksService.findById("non-existent-task-id")).rejects.toThrow(NotFoundException);
	});

	it("should find tasks by user and status", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		// Create multiple tasks with different statuses
		await tasksService.createTask({
			name: "todo task 1",
			description: "todo task 1 description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		await tasksService.createTask({
			name: "todo task 2",
			description: "todo task 2 description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		await tasksService.createTask({
			name: "done task",
			description: "done task description",
			status: TaskStatus.DONE,
			userId: user.id,
			projectId: project.id,
		});

		const todoTasks = await tasksService.findTasksByUserAndStatus(user.id, {
			status: TaskStatus.TODO,
		});

		expect(todoTasks).toHaveLength(2);
		expect(todoTasks[0].status).toEqual(TaskStatus.TODO);
		expect(todoTasks[1].status).toEqual(TaskStatus.TODO);
		expect(todoTasks[0].project).toBeDefined();
		expect(todoTasks[0].project.id).toEqual(project.id);
		expect(todoTasks[0].project.name).toEqual("test project");
	});

	it("should find tasks by user and status with pagination", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		// Create 5 tasks with TODO status
		for (let i = 1; i <= 5; i++) {
			await tasksService.createTask({
				name: `todo task ${i}`,
				description: `todo task ${i} description`,
				status: TaskStatus.TODO,
				userId: user.id,
				projectId: project.id,
			});
		}

		const firstPage = await tasksService.findTasksByUserAndStatus(user.id, {
			status: TaskStatus.TODO,
			page: 1,
			pageSize: 2,
		});

		const secondPage = await tasksService.findTasksByUserAndStatus(user.id, {
			status: TaskStatus.TODO,
			page: 2,
			pageSize: 2,
		});

		expect(firstPage).toHaveLength(2);
		expect(secondPage).toHaveLength(2);
		expect(firstPage[0].id).not.toEqual(secondPage[0].id);
	});

	it("should throw if trying to find tasks for non-existent user", async () => {
		const findTasksDto: FindTasksDto = {
			status: TaskStatus.TODO,
		};

		expect(tasksService.findTasksByUserAndStatus("non-existent-user-id", findTasksDto)).rejects.toThrow(
			NotFoundException,
		);
	});

	it("should count tasks by user and status", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		// Create 3 TODO tasks
		for (let i = 1; i <= 3; i++) {
			await tasksService.createTask({
				name: `todo task ${i}`,
				description: `todo task ${i} description`,
				status: TaskStatus.TODO,
				userId: user.id,
				projectId: project.id,
			});
		}

		// Create 2 DONE tasks
		for (let i = 1; i <= 2; i++) {
			await tasksService.createTask({
				name: `done task ${i}`,
				description: `done task ${i} description`,
				status: TaskStatus.DONE,
				userId: user.id,
				projectId: project.id,
			});
		}

		const todoCount = await tasksService.countTasks(user.id, TaskStatus.TODO);
		const doneCount = await tasksService.countTasks(user.id, TaskStatus.DONE);

		expect(todoCount.count).toEqual(3);
		expect(doneCount.count).toEqual(2);
	});

	it("should throw if trying to count tasks for non-existent user", async () => {
		expect(tasksService.countTasks("non-existent-user-id", TaskStatus.TODO)).rejects.toThrow(
			NotFoundException,
		);
	});

	it("should update a task", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		const updatedTask = await tasksService.updateTask(createdTask.id, {
			name: "updated task name",
			description: "updated task description",
			status: TaskStatus.DOING,
		});

		expect(updatedTask).toBeDefined();
		expect(updatedTask.id).toEqual(createdTask.id);
		expect(updatedTask.name).toEqual("updated task name");
		expect(updatedTask.description).toEqual("updated task description");
		expect(updatedTask.status).toEqual(TaskStatus.DOING);
	});

	it("should update a task with new user", async () => {
		const user1 = await usersService.createUser({
			firstName: "test1",
			lastName: "test1",
			email: "test1@test.com",
			location: "test1",
		});

		const user2 = await usersService.createUser({
			firstName: "test2",
			lastName: "test2",
			email: "test2@test.com",
			location: "test2",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user1.id,
			projectId: project.id,
		});

		const updatedTask = await tasksService.updateTask(createdTask.id, {
			userId: user2.id,
		});

		expect(updatedTask).toBeDefined();
		expect(updatedTask.id).toEqual(createdTask.id);
		expect(updatedTask.user.id).toEqual(user2.id);
	});

	it("should update a task with new project", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project1 = await projectsService.createProject("test project 1", "test description 1");
		const project2 = await projectsService.createProject("test project 2", "test description 2");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project1.id,
		});

		const updatedTask = await tasksService.updateTask(createdTask.id, {
			projectId: project2.id,
		});

		expect(updatedTask).toBeDefined();
		expect(updatedTask.id).toEqual(createdTask.id);
		expect(updatedTask.project.id).toEqual(project2.id);
	});

	it("should throw if trying to update a task that doesn't exist", async () => {
		const updateTaskDto: UpdateTaskDto = {
			name: "updated task name",
			status: TaskStatus.DOING,
		};

		expect(tasksService.updateTask("non-existent-task-id", updateTaskDto)).rejects.toThrow(
			NotFoundException,
		);
	});

	it("should throw if trying to update a task with non-existent user", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		expect(
			tasksService.updateTask(createdTask.id, {
				userId: "non-existent-user-id",
			}),
		).rejects.toThrow(NotFoundException);
	});

	it("should throw if trying to update a task with non-existent project", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		expect(
			tasksService.updateTask(createdTask.id, {
				projectId: "non-existent-project-id",
			}),
		).rejects.toThrow(NotFoundException);
	});

	it("should delete a task", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		const deleteResult = await tasksService.deleteTask(createdTask.id);

		expect(deleteResult).toBeDefined();
		expect(deleteResult.deleted).toBe(true);
		expect(deleteResult.message).toEqual("Task deleted sucessfully");

		expect(tasksService.findById(createdTask.id)).rejects.toThrow(NotFoundException);
	});

	it("should throw if trying to delete a task that doesn't exist", async () => {
		expect(tasksService.deleteTask("non-existent-task-id")).rejects.toThrow(NotFoundException);
	});

	it("should throw if trying to delete a task that's already been deleted", async () => {
		const user = await usersService.createUser({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			location: "test",
		});

		const project = await projectsService.createProject("test project", "test description");

		const createdTask = await tasksService.createTask({
			name: "test task",
			description: "test task description",
			status: TaskStatus.TODO,
			userId: user.id,
			projectId: project.id,
		});

		await tasksService.deleteTask(createdTask.id);
		expect(tasksService.deleteTask(createdTask.id)).rejects.toThrow(NotFoundException);
	});
});
