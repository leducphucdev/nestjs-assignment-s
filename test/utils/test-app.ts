import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ApiService } from "src/api/auth/api.service";
import { AppModule } from "src/app.module";
import request from "supertest";
import { DataSource } from "typeorm";
export class TestApp {
	app: INestApplication;
	apiKey: string;
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

		const apiService = moduleFixture.get<ApiService>(ApiService);
		const apiKey = await apiService.generateKey();
		testApp.apiKey = apiKey.id;

        

		return testApp;
	}

	private getHttpServer() {
		return this.app.getHttpServer();
	}

	getRequest() {
		return this.authRequest(this.getHttpServer(), this.apiKey);
	}

	async close() {
		return this.app.close();
	}

	private authRequest(server, key) {
		return {
			get: (url) => request(server).get(url).set("x-api-key", key),
			post: (url) => request(server).post(url).set("x-api-key", key),
			patch: (url) => request(server).patch(url).set("x-api-key", key),
			delete: (url) => request(server).delete(url).set("x-api-key", key),
		};
	}
}
