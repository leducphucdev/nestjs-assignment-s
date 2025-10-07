import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiKey } from "./api-key.entity";

@Injectable()
export class ApiService {
	constructor(@InjectRepository(ApiKey) private apiRepository: Repository<ApiKey>) {}

	/**
	 * Retrieves an API Key by its UUID from the database
	 *
	 * @param key - The unique UUID of the API Key
	 * @returns Promise that resolves to the found ApiKey entity or a null value
	 * @throws {UnauthorizedException} If the providded api key isn't active
	 */
	async findKey(key: string): Promise<ApiKey | null> {
		const apiKey = await this.apiRepository.findOne({ where: { id: key } });

		if (apiKey && !apiKey.isActive) {
			throw new UnauthorizedException("Please provide a valid and active API Key");
		}

		return apiKey;
	}

	/**
	 * Generates a new unique API Key
	 *
	 * @returns Promise that resolves to the new generated API Key
	 */
	async generateKey(): Promise<ApiKey> {
		const key = this.apiRepository.create();

		return this.apiRepository.save(key);
	}
}
