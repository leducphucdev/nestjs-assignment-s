import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
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
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET') as string,
				signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') as unknown as number },
			}),
			inject: [ConfigService],
		}),
	],
	providers: [ApiService, JwtAuthService, JwtStrategy],
	exports: [ApiService, JwtAuthService, JwtModule],
})
export class AuthModule {}
