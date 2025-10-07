import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiKey } from "./api-key.entity";
import { ApiService } from "./api.service";

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([ApiKey])],
	providers: [ApiService],
	exports: [ApiService],
})
export class AuthModule {}
