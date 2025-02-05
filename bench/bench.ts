import { xinit } from "../test/load.ts";
import { inputTrans } from "../src/main.ts";

xinit(true);

Deno.bench({
	name: "xn",
	fn() {
		inputTrans("nihaoshijie");
	},
});
