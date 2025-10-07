import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

@Injectable()
export class DbUtilsService {
	/**
	 * Handles database operation errors consistently across service methods
	 *
	 * @param err - The error caught during a database operation
	 * @throws {InternalServerErrorException} - With appropriate error message
	 */
	private handleDbError(err: unknown): never {
		if (err instanceof QueryFailedError) {
			throw new InternalServerErrorException(`Database error: ${err.message}`);
		}
		throw new InternalServerErrorException("An unexpected error occurred");
	}

	/**
	 * Executes a database operation safely with error handling
	 *
	 * @param fn - Function representing the database operation to perform
	 * @returns The result of the database operation
	 */
	public async executeSafely<T>(fn: () => Promise<T>): Promise<T> {
		try {
			return await fn();
		} catch (err: unknown) {
			return this.handleDbError(err);
		}
	}
}
