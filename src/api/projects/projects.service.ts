import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { omit } from "lodash";
import { DbUtilsService } from "src/common/services/db-utils.service";
import { DeleteStatus } from "src/common/types";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { ManageProjectUsersDto } from "./dtos/manage-project-users.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { Project } from "./project.entity";

@Injectable()
export class ProjectsService {
	constructor(
		@InjectRepository(Project) private projectRepository: Repository<Project>,
		private usersService: UsersService,
		private dbUtilsService: DbUtilsService,
	) {}

	/**
	 * Retrieves a project by its UUID from the database
	 *
	 * @param id - The unique id of the project
	 * @returns Promise that resolves to the found Project entity
	 * @throws {NotFoundException} - If no project is found with the given UUID
	 */
	async findById(id: string, loadUser = false): Promise<Project> {
		const project = await this.dbUtilsService.executeSafely(() =>
			this.projectRepository.findOne({
				where: { id },
				relations: { users: loadUser },
			}),
		);

		if (!project) throw new NotFoundException("Project does not exist");

		return project;
	}

	/**
	 * Retrieves a project by its name from the database
	 *
	 * @param name - The name of the project
	 * @returns Promise that resolves to the found Project entity
	 * @throws {NotFoundException} - If no project is found with the given name
	 */
	async findByName(name: string, userId: string): Promise<Project[]> {
		await this.usersService.findById(userId);

		const project = await this.dbUtilsService.executeSafely(() =>
			this.projectRepository.find({
				where: { name, users: { id: userId } },
				relations: { users: true },
				order: { createdAt: "DESC" },
			}),
		);

		if (!project.length) throw new NotFoundException(`Project '${name}' does not exist`);

		return project;
	}

	/**
	 * Creates a new project and saves it to the database
	 *
	 * @param name - The name of the project
	 * @param description - The project description
	 * @returns Promise that resolves to the created Project entity
	 */
	async createProject(name: string, description: string): Promise<Project> {
		const project = this.projectRepository.create({ name, description });

		return this.dbUtilsService.executeSafely(() => this.projectRepository.save(project));
	}

	/**
	 * Updates a specific project with the new given attributes
	 *
	 * @param id - The unique UUID of the project
	 * @param attrs - Attributes of the Project entity to update
	 * @returns Promise that resolves to the updated Project entity
	 */
	async updateProject(id: string, attrs: UpdateProjectDto) {
		const project = await this.findById(id);

		return this.dbUtilsService.executeSafely(() =>
			this.projectRepository.save({ ...project, ...attrs }),
		);
	}

	/**
	 * Manages adding into or removing users from a project
	 *
	 * @param projectId - The unique UUID of the project
	 * @param userId - The unique UUID of the user
	 * @param operation - Operation we want to perform ("add" or "remove")
	 * @returns
	 */
	private async manageProjectUsers(
		projectId: string,
		userId: string,
		operation: "add" | "remove",
	): Promise<Project> {
		const project = await this.findById(projectId, true);
		await this.usersService.findById(userId);

		const existsInProject = project.users.map((u) => u.id).includes(userId);

		if (operation === "add") {
			if (existsInProject) throw new BadRequestException("User is already added to project");

			const user = await this.usersService.findById(userId);
			project.users.push(user);
		}

		if (operation === "remove") {
			if (!existsInProject) throw new BadRequestException("User doesn't exist in project");

			const position = project.users.findIndex((u) => u.id === userId);
			project.users.splice(position, 1);
		}

		return this.dbUtilsService.executeSafely(() => this.projectRepository.save(project));
	}

	/**
	 * Adds a user to a specific project
	 *
	 * @param projectId The unique UUID of the project
	 * @param userId The unique UUID of the user
	 * @returns Promise that resolves to the added Project entity
	 * @throws {BadRequestException} - If user is already added to the project
	 */
	async addUser(payload: ManageProjectUsersDto): Promise<Project> {
		return this.manageProjectUsers(payload.projectId, payload.userId, "add");
	}

	/**
	 * Removes a user from a specific project
	 *
	 * @param projectId The unique UUID of the project
	 * @param userId The unique UUID of the user
	 * @returns Promise that resolves to the added Project entity
	 * @throws {BadRequestException} - If user isn't part of the project
	 */
	async removeUser(payload: ManageProjectUsersDto): Promise<Project> {
		return this.manageProjectUsers(payload.projectId, payload.userId, "remove");
	}

	/**
	 * Deletes a project by its UUID from the database
	 *
	 * @param id - The unique UUID of the project
	 * @returns Promise that resolves to the DeleteStatus type
	 */
	async deleteProject(id: string): Promise<DeleteStatus> {
		const project = await this.findById(id);

		await this.dbUtilsService.executeSafely(() => this.projectRepository.remove(project));

		return { deleted: true, message: "Project deleted successfully" };
	}
}
