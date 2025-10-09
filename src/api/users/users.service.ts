import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DbUtilsService } from "src/common/services/db-utils.service";
import { DeleteStatus } from "src/common/types";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private dbUtilsService: DbUtilsService,
	) {}

	/**
	 * Retrieves a user by its UUID from the database
	 *
	 * @param id - The unique id of the user
	 * @returns Promise that resolves to the found User entity
	 * @throws {NotFoundException} - If no user is found with the given UUID
	 */
	async findById(id: string): Promise<User> {
		const user = await this.dbUtilsService.executeSafely(() =>
			this.userRepository.findOne({ where: { id } }),
		);

		if (!user || user.deletedAt) throw new NotFoundException("User does not exist");

		return user;
	}

	/**
	 * Retrieves a user by its email address from the database
	 *
	 * @param email - The unique email of the user
	 * @param throwsError - If we want to throw an error if a user wasn't found
	 * @returns Promise that resolves to the found User entity or a null value
	 * @throws {NotFoundException} - If a user with the given email doesn't exist (optional)
	 */
	async findByEmail(email: string, throwsError = false): Promise<User | null> {
		const user = await this.dbUtilsService.executeSafely(() =>
			this.userRepository.findOne({ where: { email } }),
		);

		if (throwsError && !user)
			throw new NotFoundException(`User with email '${email} not found'`);

		return user;
	}

	/**
	 * Creates a new user and saves it to the database
	 *
	 * @param payload - The required information to create a user
	 * @returns Promise that resolves to the created User entity
	 */
	async  createUser(payload: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(payload.email);
    if (existingUser) {
        throw new BadRequestException("Email is already taken");
    }

		const newUser = this.userRepository.create(payload);

		return this.dbUtilsService.executeSafely(() => this.userRepository.save(newUser));
	}

	/**
	 * Updates a specific user with the new given attributes
	 *
	 * @param id - The unique UUID of the user
	 * @param attrs - Attributes of the User entity to update
	 * @returns Promise that resolves to the updated User entity
	 */
	async updateUser(id: string, attrs: UpdateUserDto): Promise<User> {
		const user = await this.findById(id);

		// Ensure email uniqueness if updating email
		if (attrs.email && attrs.email !== user.email) {
			const existingUser = await this.findByEmail(attrs.email);
			if (existingUser && existingUser.id !== id) {
				throw new BadRequestException("Email is already taken");
			}
		}

		return this.dbUtilsService.executeSafely(() =>
			this.userRepository.save({ ...user, ...attrs }),
		);
	}

	/**
	 * Deletes a user by its UUID from the database
	 *
	 * @param id - The unique UUID of the user
	 * @returns Promise that resolves to the DeleteStatus type
	 */
	async deleteUser(id: string): Promise<DeleteStatus> {
		const user = await this.findById(id);
		user.deletedAt = new Date();

		await this.dbUtilsService.executeSafely(() => this.userRepository.save(user));
		return { deleted: true, message: "User deleted successfully" };
	}
}
