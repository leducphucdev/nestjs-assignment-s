import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import request from "supertest";
import { DataSource } from "typeorm";
import { UsersService } from "src/api/users/users.service";
import { JwtAuthService } from "src/api/auth/jwt-auth.service";

export class TestApp {
	app: INestApplication;
	accessToken: string;
	testUUID = "2ba986fa-28a3-4b20-ac4a-5b2b09238154";

	static async create(): Promise<TestApp> {
		const testApp = new TestApp();
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		testApp.app = moduleFixture.createNestApplication();
		await testApp.app.init();

		const dataSouce = testApp.app.get(DataSource);
		await dataSouce.synchronize(true);

		// Create a test user and generate JWT token
		const usersService = moduleFixture.get<UsersService>(UsersService);
		const jwtAuthService = moduleFixture.get<JwtAuthService>(JwtAuthService);
		
		const testUser = await usersService.createUser({
			firstName: "Test",
			lastName: "User",
			email: "test@example.com",
			location: "Test Location",
		});
		
		const tokenResponse = await jwtAuthService.generateToken(testUser);
		testApp.accessToken = tokenResponse.access_token;

		return testApp;
	}

	private getHttpServer() {
		return this.app.getHttpServer();
	}

	getRequest() {
		return this.authRequest(this.getHttpServer(), this.accessToken);
	}

	async close() {
		return this.app.close();
	}

	private authRequest(server, token) {
		return {
			get: (url) => request(server).get(url).set("xt-sol-api-key", token),
			post: (url) => request(server).post(url).set("xt-sol-api-key", token),
			patch: (url) => request(server).patch(url).set("xt-sol-api-key", token),
			delete: (url) => request(server).delete(url).set("xt-sol-api-key", token),
		};
	}
}
