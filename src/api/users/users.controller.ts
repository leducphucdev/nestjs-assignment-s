import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from "@nestjs/common";
import { DeleteStatus } from "src/common/types";
import { EmailValidationPipe } from "../pipes/email.pipe";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller("/users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get("/:id")
	async findUserById(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
		return this.usersService.findById(id);
	}

	@Get("/email/:email")
	async findUserByEmail(
		@Param("email", EmailValidationPipe) email: string,
	): Promise<User | null> {
		return this.usersService.findByEmail(email, true);
	}

	@Post("/create")
	async createUser(@Body() body: CreateUserDto): Promise<User> {
		return this.usersService.createUser(body);
	}

	@Patch("/:id")
	async updateUser(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() body: UpdateUserDto,
	): Promise<User> {
		return this.usersService.updateUser(id, body);
	}

	@Delete("/:id")
	async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<DeleteStatus> {
		return this.usersService.deleteUser(id);
	}
}
