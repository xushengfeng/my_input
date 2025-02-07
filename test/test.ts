import { xinit } from "./load.ts";
import { inputTrans } from "../src/main.ts";
import { assertEquals } from "jsr:@std/assert";

xinit();

Deno.test({
	name: "基本",
	fn() {
		assertEquals(inputTrans("nihao").pureText.includes("你好"), true);
	},
});

Deno.test({
	name: "句子",
	fn() {
		const l = inputTrans("nihaoshijie");
		console.log(l);
		assertEquals(l.pureText.includes("你好世界"), true);
	},
});

Deno.test({
	name: "输入过程",
	fn() {
		const p = "nihaoshijie";
		for (let i = 0; i < p.length; i++) {
			const l = inputTrans(p.slice(0, i + 1));
			console.log(p.slice(0, i + 1), l.pureText);
		}
	},
});
