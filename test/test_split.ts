import { xinit } from "./load.ts";
import { split } from "../src/split.ts";
import { assertEquals } from "jsr:@std/assert";

const { ziPinYin, codeExt, szmMap } = xinit();
const someKeys = ziPinYin;

const pyj = ",";

Deno.test({
	name: "输入键转拼音",
	fn() {
		for (const i of [["ni", "hao", "shi", "jie"]]) {
			const j = i.join("");
			const jj = i.join(pyj);
			const x = split(j, { alCodes: someKeys });
			const t = x.find((i) => i.map((i) => i.code[0]).join(pyj) === jj);
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
		const x = l.find((x) => {
			for (const [i, v] of ["ni", "hao", "shi", "jie", "shang"].entries()) {
				if (!x[i].code.includes(v)) return false;
			}
			return true;
		});
		assertEquals(Boolean(x), true);
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
		const l = split("sunahuos", {
			alCodes: someKeys,
			codeExt,
		});
		console.log(l, l.length);
	},
});

Deno.test({
	name: "补全",
	fn() {
		const l = split("sh", {
			alCodes: someKeys,
			partKeys: szmMap,
		});
		assertEquals((l[0].at(-1)?.code.length ?? 0) > 1, true);
		console.log(l, l.length);
		const l2 = split("sunahuos", {
			alCodes: someKeys,
			partKeys: szmMap,
		});
		assertEquals((l2[0].at(-1)?.code.length ?? 0) > 1, true);
		console.log(l2, l2.length);
	},
});
