import { xinit } from "./load.ts";
import { code2sen } from "../src/sen.ts";

const { allMap } = xinit();

Deno.test({
	name: "词2字",
	fn() {
		const s = code2sen([{ code: "ni", start: 0, end: 2 }], allMap);
		console.log(s);
	},
});

Deno.test({
	name: "词2词",
	fn() {
		const s = code2sen(
			[
				{ code: "zi", start: 0, end: 2 },
				{ code: "ci", start: 2, end: 4 },
			],
			allMap,
		);
		console.log(s);
	},
});

Deno.test({
	name: "词2句子",
	fn() {
		const s = code2sen(
			[
				{ code: "ni", start: 0, end: 2 },
				{ code: "hao", start: 2, end: 5 },
				{ code: "shi", start: 5, end: 8 },
				{ code: "jie", start: 8, end: 11 },
			],
			allMap,
		);
		console.log(s);
	},
});
