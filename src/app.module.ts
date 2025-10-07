import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import { AuthModule } from "./api/auth/auth.module";
import { AuthGuard } from "./api/guards/auth.guard";
import { ProjectsModule } from "./api/projects/projects.module";
import { TasksModule } from "./api/tasks/tasks.module";
import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { config } from "./config/data-source.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.env.${process.env.NODE_ENV}`],
        }),
        TypeOrmModule.forRoot(config as DataSourceOptions),
        UsersModule,
        ProjectsModule,
        TasksModule,
        CommonModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        ConfigService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
