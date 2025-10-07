import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Request } from "express";
import { ApiService } from "../auth/api.service";

export class AuthGuard implements CanActivate {
	constructor(@Inject() private apiService: ApiService) {}

	async canActivate(context: ExecutionContext) {
		const req: Request = context.switchToHttp().getRequest();
		const providedKey = req.headers["x-api-key"] as string;

		if (!providedKey) return false;

		const key = await this.apiService.findKey(providedKey);

		if (!key) return false;
		return true;
	}
}
