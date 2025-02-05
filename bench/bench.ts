import { xinit } from "../test/load.ts";
import { inputTrans } from "../src/main.ts";

xinit(true);

Deno.bench({
	name: "xn",
	fn() {
		inputTrans("nihaoshijie");
	},
});

function generateRandomString(length: number): string {
	const characters = "abcdefghijklmnopqrstuvwxyz";
	let result = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}

	return result;
}

Deno.bench({
	name: "random",
	fn(t) {
		const s = generateRandomString(11);
		t.start();
		inputTrans(s);
		t.end();
	},
});

Deno.bench({
	name: "random20",
	fn(t) {
		const s = generateRandomString(20);
		t.start();
		inputTrans(s);
		t.end();
	},
});
