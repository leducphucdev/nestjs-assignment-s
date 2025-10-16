import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		
		// Define public routes that don't require authentication
		const publicRoutes = [
			'/users/create',
			'/users/login',
		];

		// Check if the current route is public
		if (publicRoutes.some(route => req.url.startsWith(route))) {
			return true;
		}

		const token = req.headers["xt-sol-api-key"] as string;

		if (!token) {
			throw new UnauthorizedException('Token not provided');
		}

		try {
			const payload = this.jwtService.verify(token);

			const user = await this.usersService.findById(payload.sub);
			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			req.user = user;
			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}
}
