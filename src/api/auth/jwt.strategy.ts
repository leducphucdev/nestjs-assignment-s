import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtAuthService } from "./jwt-auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private jwtAuthService: JwtAuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromHeader('xt-sol-api-key'),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: any) {
		try {
			const user = await this.jwtAuthService.validateToken(payload);
			return user;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}
}