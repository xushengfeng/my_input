import { xinit } from "./load.ts";
import { code2sen } from "../src/sen.ts";

const { allMap } = xinit();

Deno.test({
	name: "词2句子",
	fn() {
		const s = code2sen(["ni", "hao", "shi", "jie"], allMap);
		console.log(s);
	},
});
