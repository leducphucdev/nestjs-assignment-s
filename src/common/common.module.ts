import { Module } from "@nestjs/common";
import { DbUtilsService } from "./services/db-utils.service";

@Module({
	providers: [DbUtilsService],
	exports: [DbUtilsService],
})
export class CommonModule {}
