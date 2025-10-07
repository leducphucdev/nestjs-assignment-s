import { Project } from "src/api/projects/project.entity";
import { Task } from "src/api/tasks/task.entity";
import { User } from "src/api/users/user.entity";
import { TestApp } from "../utils/test-app";

describe("Tasks endpoint", () => {
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
			.send({ name: "test", description: "test" })
			.expect(201);

		user = resUser.body;
		project = resProject.body;
	});

	afterEach(async () => {
		await testApp.close();
	});

	it("/tasks/create -> POST", async () => {
		return testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);
	});

	it("/tasks/create -> POST (Invalid UUIDs)", async () => {
		return testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: "1",
				projectId: "1",
			})
			.expect(400);
	});

	it("/tasks/create -> POST (User not Found)", async () => {
		return testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: testApp.testUUID,
				projectId: project.id,
			})
			.expect(404);
	});

	it("/tasks/create -> POST (Project not Found)", async () => {
		return testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: testApp.testUUID,
			})
			.expect(404);
	});

	it("/tasks/:taskId -> GET", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		return testApp
			.getRequest()
			.get(`/tasks/${task.id}`)
			.expect(200)
			.then((res) => {
				expect(task.name).toEqual("test");
				expect(task.description).toEqual("test");
			});
	});

	it("/tasks/:taskId -> GET (Invalid UUID)", async () => {
		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		return testApp.getRequest().get("/tasks/1").expect(400);
	});

	it("/tasks/:taskId -> GET (User not Found)", async () => {
		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		return testApp.getRequest().get(`/tasks/${testApp.testUUID}`).expect(404);
	});

	it("/tasks/user/:userId?status=TODO -> GET", async () => {
		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test2",
				description: "test2",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test3",
				description: "test3",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		return testApp
			.getRequest()
			.get(`/tasks/user/${user.id}?status=TODO`)
			.expect(200)
			.then((res) => {
				expect(res.body).toHaveLength(3);
			});
	});

	it("/tasks/user/:userId?status=DOING -> GET (Invalid UUID)", async () => {
		return testApp.getRequest().get("/tasks/user/1?status=DOING").expect(400);
	});

	it("/tasks/user/:userId?status=DONE -> GET (User not Found)", async () => {
		return testApp.getRequest().get(`/tasks/user/${testApp.testUUID}?status=DONE`).expect(404);
	});

	it("/tasks/user/:userId?status=TODO&page=2&pageSize=1 -> GET", async () => {
		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test2",
				description: "test2",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		return testApp
			.getRequest()
			.get(`/tasks/user/${user.id}?status=TODO&page=2&pageSize=1`)
			.expect(200)
			.then((res) => {
				expect(res.body).toHaveLength(1);
				expect(res.body[0].name).toEqual("test"); // Ordered by creation date (newest first)
			});
	});

	it("/tasks/:taskId -> PATCH", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.patch(`/tasks/${task.id}`)
			.send({ status: "DONE" })
			.expect(200)
			.then((res) => {
				expect(res.body.status).toEqual("DONE");
			});
	});

	it("/tasks/:taskId -> PATCH (Invalid UUID)", async () => {
		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp.getRequest().patch("/tasks/1").send({ status: "DONE" }).expect(400);
	});

	it("/tasks/:taskId -> PATCH (Task not Found)", async () => {
		await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.patch(`/tasks/${testApp.testUUID}`)
			.send({ status: "DONE" })
			.expect(404);
	});

	it("/tasks/:taskId -> PATCH (Invalid user UUID)", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp.getRequest().patch(`/tasks/${task.id}`).send({ userId: "1" }).expect(400);
	});

	it("/tasks/:taskId -> PATCH (User not Found)", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.patch(`/tasks/${task.id}`)
			.send({ userId: testApp.testUUID })
			.expect(404);
	});

	it("/tasks/:taskId -> PATCH (Invalid project UUID)", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp.getRequest().patch(`/tasks/${task.id}`).send({ projectId: "1" }).expect(400);
	});

	it("/tasks/:taskId -> PATCH (Project not Found)", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp
			.getRequest()
			.patch(`/tasks/${task.id}`)
			.send({ projectId: testApp.testUUID })
			.expect(404);
	});

	it("/tasks/:taskId -> DELETE", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp.getRequest().delete(`/tasks/${task.id}`).expect(200);
		await testApp.getRequest().get(`/tasks/${task.id}`).expect(404);
	});

	it("/tasks/:taskId -> DELETE (Invalid UUID)", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp.getRequest().delete("/tasks/1").expect(400);
	});

	it("/tasks/:taskId -> DELETE (Task not Found)", async () => {
		const { body: task }: { body: Task } = await testApp
			.getRequest()
			.post("/tasks/create")
			.send({
				name: "test",
				description: "test",
				status: "TODO",
				userId: user.id,
				projectId: project.id,
			})
			.expect(201);

		await testApp.getRequest().delete(`/tasks/${testApp.testUUID}`).expect(404);
	});
});
