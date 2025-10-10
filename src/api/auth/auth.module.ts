import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { ApiKey } from "./api-key.entity";
import { ApiService } from "./api.service";
import { JwtAuthService } from "./jwt-auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([ApiKey]),
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '10m' },
		}),
	],
	providers: [ApiService, JwtAuthService, JwtStrategy],
	exports: [ApiService, JwtAuthService, JwtModule],
})
export class AuthModule {}
