import { xinit } from "./load.ts";
import { split } from "../src/split.ts";
import { assertEquals } from "jsr:@std/assert";

const { ziPinYin, codeExt } = xinit();
const someKeys = ziPinYin;

const pyj = ",";

Deno.test({
	name: "输入键转拼音",
	fn() {
		for (const i of [["ni", "hao", "shi", "jie"]]) {
			const j = i.join("");
			const jj = i.join(pyj);
			const x = split(j, { alCodes: someKeys });
			const t = x.find((i) => i.map((i) => i.code).join(pyj) === jj);
			assertEquals(Boolean(t), true);
			if (!t) return;
			for (const [n, v] of t.entries()) {
				assertEquals(i[n], j.slice(v.start, v.end));
			}
		}
	},
});

Deno.test({
	name: "模糊音",
	fn() {
		const l = split("nihaosijieshang", { alCodes: someKeys, codeExt });
		console.log(l);
		assertEquals(
			l
				.map((i) => i.map((i) => i.code).join(pyj))
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

Deno.test({
	name: "歧义拼音",
	fn() {
		const l = split("sunahuo", {
			alCodes: someKeys,
			codeExt,
		});
		console.log(l, l.length);
	},
});
