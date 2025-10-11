import { Project } from "src/api/projects/project.entity";
import { User } from "src/api/users/user.entity";
import { TestApp } from "../utils/test-app";

describe("Projects endpoint", () => {
	let testApp: TestApp;
	let user: User;
	let project: Project;

	beforeEach(async () => {
		testApp = await TestApp.create();

		const resUser = await testApp
			.getRequest()
			.post("/users/create")
			.send({ firstName: "test", lastName: "test", email: "test@test.com", location: "test" })
			.expect(201);

		const resProject = await testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);

		user = resUser.body;
		project = resProject.body;
	});

	afterEach(async () => {
		await testApp.close();
	});

	it("/projects/create -> POST", async () => {
		return testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);
	});

	it("/projects/:projectId -> GET", async () => {
		return testApp
			.getRequest()
			.get(`/projects/${project.id}`)
			.expect(200)
			.then((res) => {
				expect(project.name).toEqual("Test");
				expect(project.description).toEqual("Test");
			});
	});

	it("/projects/:projectId -> GET (Invalid UUID)", async () => {
		return testApp.getRequest().get("/projects/1").expect(400);
	});

	it("/projects/:projectId -> GET (Not Found)", async () => {
		return testApp.getRequest().get(`/projects/${testApp.testUUID}`).expect(404);
	});

	it("/projects/name/:name?userId=:userId -> GET", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.get(`/projects/name/${project.name}?userId=${user.id}`)
			.expect(200);
	});

	it("/projects/name/:name?userId=:userId -> GET (Invalid UUID)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp.getRequest().get(`/projects/name/${project.name}?userId=1`).expect(400);
	});

	it("/projects/name/:name?userId=:userId -> GET (User not Found)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.get(`/projects/name/${project.name}?userId=${testApp.testUUID}`)
			.expect(404);
	});

	it("/projects/name/:name?userId=:userId -> GET (Project not Found)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.get(`/projects/name/not_a_project?userId=${user.id}`)
			.expect(404);
	});

	it("/projects/users/add -> PATCH", async () => {
		return testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200)
			.then((res) => {
				expect(res.body.users).toHaveLength(1);
			});
	});

	it("/projects/users/add -> PATCH (Invalid UUIDs)", async () => {
		return testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: "1",
				userId: "1",
			})
			.expect(400);
	});

	it("/projects/users/add -> PATCH (User not Found)", async () => {
		return testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: testApp.testUUID,
			})
			.expect(404);
	});

	it("/projects/users/add -> PATCH (Project not Found)", async () => {
		return testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: testApp.testUUID,
				userId: user.id,
			})
			.expect(404);
	});

	it("/projects/users/add -> PATCH (User already in project)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(400);
	});

	it("/projects/users/remove -> PATCH", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.patch("/projects/user/remove")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200)
			.then((res) => {
				expect(res.body.users).toHaveLength(0);
			});
	});

	it("/projects/users/remove -> PATCH (Invalid UUIDs)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.patch("/projects/user/remove")
			.send({
				projectId: "1",
				userId: "2",
			})
			.expect(400);
	});

	it("/projects/users/remove -> PATCH (User not in project)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.patch("/projects/user/remove")
			.send({
				projectId: project.id,
				userId: testApp.testUUID,
			})
			.expect(404);
	});

	it("/projects/users/remove -> PATCH (Project not Found)", async () => {
		await testApp
			.getRequest()
			.patch("/projects/user/add")
			.send({
				projectId: project.id,
				userId: user.id,
			})
			.expect(200);

		return testApp
			.getRequest()
			.patch("/projects/user/remove")
			.send({
				projectId: testApp.testUUID,
				userId: user.id,
			})
			.expect(404);
	});

	it("/projects/:projectId -> PATCH", async () => {
		return testApp
			.getRequest()
			.patch(`/projects/${project.id}`)
			.send({ name: "TEST" })
			.expect(200)
			.then((res) => {
				expect(res.body.name).toEqual("TEST");
			});
	});

	it("/projects/:projectId -> PATCH (Invalid UUID)", async () => {
		await testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);

		return testApp.getRequest().patch("/projects/1").send({ name: "TEST" }).expect(400);
	});

	it("/projects/:projectId -> PATCH (Project not Found)", async () => {
		await testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);

		return testApp
			.getRequest()
			.patch(`/projects/${testApp.testUUID}`)
			.send({ name: "TEST" })
			.expect(404);
	});

	it("/projects/:projectId -> DELETE", async () => {
		const { body: project }: { body: Project } = await testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);

		await testApp.getRequest().delete(`/projects/${project.id}`).expect(200);
		await testApp.getRequest().get(`/projects/${project.id}`).expect(404);
	});

	it("/projects/:projectId -> DELETE (Invalid UUID)", async () => {
		await testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);

		await testApp.getRequest().delete("/projects/1").expect(400);
	});

	it("/projects/:projectId -> DELETE (Project not Found)", async () => {
		await testApp
			.getRequest()
			.post("/projects/create")
			.send({ name: "Test", description: "Test" })
			.expect(201);

		await testApp.getRequest().delete(`/projects/${testApp.testUUID}`).expect(404);
	});
});
