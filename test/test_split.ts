import { xinit } from "./load.ts";
import { split } from "../src/split.ts";
import { assertEquals } from "jsr:@std/assert";

const { baseMap, codeExt } = xinit();
const someKeys = Array.from(baseMap.keys() ?? []);

const pyj = ",";

Deno.test({
	name: "输入键转拼音",
	fn() {
		assertEquals(
			split("nihaoshijie", { alCodes: someKeys })
				.map((i) => i.join(pyj))
				.includes(["ni", "hao", "shi", "jie"].join(pyj)),
			true,
		);
	},
});

Deno.test({
	name: "模糊音",
	fn() {
		const l = split("nihaosijieshang", { alCodes: someKeys, codeExt });
		console.log(l);
		assertEquals(
			l
				.map((i) => i.join(pyj))
				.includes(["ni", "hao", "shi", "jie", "shang"].join(pyj)),
			true,
		);
	},
});

Deno.test({
	name: "模糊音数量",
	fn() {
		const l = split("shanshanshanshanshanshanshan", {
			alCodes: someKeys,
			codeExt,
		});
		console.log(l, l.length);
	},
});
