import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DbUtilsService } from "../../common/services/db-utils.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("User controller", () => {
	let controller: UsersController;
	let fakeUsersService: Partial<UsersService>;
	let fakeDbUtilsService: Partial<DbUtilsService>;

	beforeEach(async () => {
		fakeDbUtilsService = {};

		fakeUsersService = {
			findById: (id: string) => {
				if (id === "no-id") {
					throw new NotFoundException("User does not exist");
				}

				return Promise.resolve({
					id: "123",
					firstName: "Test",
					lastName: "Test",
					email: "example@email.com",
					location: "Test",
				} as User);
			},
			createUser: (payload) => {
				return Promise.resolve({
					id: "123",
					firstName: "Test",
					lastName: "Test",
					email: "example@email.com",
					location: "Test",
				} as User);
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{ provide: UsersService, useValue: fakeUsersService },
				{ provide: DbUtilsService, useValue: fakeDbUtilsService },
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should throw when user isn't found", async () => {
		await expect(controller.findUserById("no-id")).rejects.toThrow(NotFoundException);
	});

	it("should return user when creating one", async () => {
		const user = await controller.createUser({
			email: "test@test.com",
			firstName: "test",
			lastName: "test",
			location: "test",
		});

		expect(user).toBeDefined();
	});
});
