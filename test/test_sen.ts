import { init } from "../src/main.ts";
import { code2sen } from "../src/sen.ts";

const { allMap } = init();

Deno.test({
	name: "词2句子",
	fn() {
		const s = code2sen(["ni", "hao", "shi", "jie"], allMap);
		console.log(s);
	},
});
