import { xinit } from "./load.ts";
import { code2sen } from "../src/sen.ts";

const { allMap } = xinit();

Deno.test({
	name: "词2字",
	fn() {
		const s = code2sen([[{ code: ["ni"], start: 0, end: 2 }]], allMap);
		console.log(s);
	},
});

Deno.test({
	name: "词2词",
	fn() {
		const s = code2sen(
			[
				[
					{ code: ["zi"], start: 0, end: 2 },
					{ code: ["ci"], start: 2, end: 4 },
				],
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
				[
					{ code: ["zhe"], start: 0, end: 3 },
					{ code: ["shi"], start: 3, end: 6 },
					{ code: ["wo"], start: 6, end: 8 },
					{ code: ["de"], start: 8, end: 10 },
					{ code: ["shu"], start: 10, end: 13 },
					{ code: ["ru"], start: 13, end: 15 },
					{ code: ["fa"], start: 15, end: 17 },
				],
			],
			allMap,
		);
		console.log(s);
	},
});

Deno.test({
	name: "优先词",
	fn() {
		const s = code2sen([[{ code: ["zhe"], start: 0, end: 3 }]], allMap, {
			wordFeq: new Map([
				["辄", 1],
				["鹧", 2],
			]),
		});
		console.log(s);
	},
});

Deno.test({
	name: "组句后面的优先词",
	fn() {
		const s = code2sen(
			[
				[
					{ code: ["de"], start: 0, end: 2 },
					{ code: ["ce"], start: 2, end: 4 },
					{ code: ["shi"], start: 4, end: 7 },
				],
			],
			allMap,
			{ wordFeq: new Map([["得", 1]]) },
		);
		console.log(s);
	},
});
