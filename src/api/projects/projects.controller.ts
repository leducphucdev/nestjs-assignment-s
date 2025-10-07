import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { DeleteStatus } from "src/common/types";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { ManageProjectUsersDto } from "./dtos/manage-project-users.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { Project } from "./project.entity";
import { ProjectsService } from "./projects.service";

@Controller("/projects")
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get("/:id")
	async findProjectById(@Param("id", ParseUUIDPipe) id: string): Promise<Project> {
		return this.projectsService.findById(id);
	}

	@Get("/name/:name")
	async findProjectByName(
		@Param("name") name: string,
		@Query("userId", ParseUUIDPipe) userId: string,
	): Promise<Project[]> {
		return this.projectsService.findByName(name, userId);
	}

	@Post("/create")
	async createProject(@Body() body: CreateProjectDto): Promise<Project> {
		return this.projectsService.createProject(body.name, body.description);
	}

	@Patch("/user/add")
	async addUserToProject(@Body() body: ManageProjectUsersDto): Promise<Project> {
		return this.projectsService.addUser(body);
	}

	@Patch("/user/remove")
	async removeUserFromProject(@Body() body: ManageProjectUsersDto): Promise<Project> {
		return this.projectsService.removeUser(body);
	}

	@Patch("/:id")
	async updateProject(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() body: UpdateProjectDto,
	): Promise<Project> {
		return this.projectsService.updateProject(id, body);
	}

	@Delete("/:id")
	async deleteProject(@Param("id", ParseUUIDPipe) id: string): Promise<DeleteStatus> {
		return this.projectsService.deleteProject(id);
	}
}
