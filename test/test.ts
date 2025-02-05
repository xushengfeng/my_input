import { xinit } from "./load.ts";
import { inputTrans } from "../src/main.ts";
import { assertEquals } from "jsr:@std/assert";

xinit();

Deno.test({
	name: "基本",
	fn() {
		assertEquals(inputTrans("nihao").includes("你好"), true);
	},
});

Deno.test({
	name: "句子",
	fn() {
		const l = inputTrans("nihaoshijie");
		console.log(l);
		assertEquals(l.includes("你好世界"), true);
	},
});
