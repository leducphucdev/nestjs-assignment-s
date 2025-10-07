import { rm } from "node:fs/promises";
import { join } from "node:path";

global.beforeEach(async () => {
	// try {
	// 	await rm(join(__dirname, "./db-test.sqlite"));
	// } catch (err) {}
});
