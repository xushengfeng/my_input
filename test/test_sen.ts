import { xinit } from "./load.ts";
import { code2sen } from "../src/sen.ts";

const { allMap } = xinit();

Deno.test({
	name: "词2字",
	fn() {
		const s = code2sen(["ni"], allMap);
		console.log(s);
	},
});

Deno.test({
	name: "词2词",
	fn() {
		const s = code2sen(["zi", "ci"], allMap);
		console.log(s);
	},
});

Deno.test({
	name: "词2句子",
	fn() {
		const s = code2sen(["ni", "hao", "shi", "jie"], allMap);
		console.log(s);
	},
});
