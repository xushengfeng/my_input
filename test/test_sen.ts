import { xinit } from "./load.ts";
import { code2sen } from "../src/sen.ts";
import type { Pinyin, ZiCiJu } from "../src/main.ts";

const { allMap } = xinit();

function i(p: string) {
	return { code: [p as Pinyin], start: 0, end: 2 };
}

Deno.test({
	name: "词2字",
	fn() {
		const s = code2sen([[i("ni")]], allMap);
		console.log(s);
	},
});

Deno.test({
	name: "词2词",
	fn() {
		const s = code2sen([[i("zi"), i("ci")]], allMap);
		console.log(s);
	},
});

Deno.test({
	name: "词2句子",
	fn() {
		const s = code2sen(
			[[i("zhe"), i("shi"), i("wo"), i("de"), i("shu"), i("ru"), i("fa")]],
			allMap,
		);
		console.log(s);
	},
});

Deno.test({
	name: "优先词",
	fn() {
		const s = code2sen([[i("zhe")]], allMap, {
			wordFeq: new Map([
				["辄" as ZiCiJu, 1],
				["鹧" as ZiCiJu, 2],
			]),
		});
		console.log(s);
	},
});

Deno.test({
	name: "组句后面的优先词",
	fn() {
		const s = code2sen([[i("de"), i("ce"), i("shi")]], allMap, {
			wordFeq: new Map([["得" as ZiCiJu, 1]]),
		});
		console.log(s);
	},
});
