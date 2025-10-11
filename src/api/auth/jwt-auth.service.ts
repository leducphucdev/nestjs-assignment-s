import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";

@Injectable()
export class JwtAuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	/**
	 * Validates user credentials and returns user if valid
	 *
	 * @param email - User's email address
	 * @param password - User's password (for now, we'll use email as password for simplicity)
	 * @returns Promise that resolves to the user if valid, null otherwise
	 */
	async validateUser(email: string): Promise<User | null> {
		const user = await this.usersService.findByEmail(email);
		return user;
	}

	/**
	 * Generates a JWT token for the given user
	 *
	 * @param user - User entity to generate token for
	 * @returns Object containing the JWT token
	 */
	async generateToken(user: User): Promise<{ access_token: string }> {
		const payload = { 
			email: user.email, 
			sub: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
		};

		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	/**
	 * Validates a JWT token and returns the user
	 *
	 * @param token - JWT token to validate
	 * @returns Promise that resolves to the user if token is valid
	 */
	async validateToken(token: string): Promise<User> {
		try {
			const payload = this.jwtService.verify(token);
			const user = await this.usersService.findById(payload.sub);
			return user;
		} catch (error) {
			throw new Error('Invalid token');
		}
	}
}