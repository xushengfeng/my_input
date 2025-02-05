import { xinit } from "./load.ts";
import { split } from "../src/split.ts";
import { assertEquals } from "jsr:@std/assert";

const { baseMap } = xinit();
const someKeys = Array.from(baseMap.keys() ?? []);

Deno.test({
	name: "输入键转拼音",
	fn() {
		assertEquals(split("nihaoshijie", someKeys), ["ni", "hao", "shi", "jie"]);
	},
});
