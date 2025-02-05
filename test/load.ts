import { loadfile } from "../x/load_file.ts";
import { init } from "../src/main.ts";

function xinit(more?: boolean) {
	if (more)
		return init({
			baseDic: ["8105.dict.yaml", "41448.dict.yaml"].map((f) =>
				loadfile(`../dic/${f}`),
			),
			groupDic: [
				"base.dict.yaml",
				"ext.dict.yaml",
				"others.dict.yaml",
				"tencent.dict.yaml",
			].map((f) => loadfile(`../dic/${f}`)),
		});
	return init({
		baseDic: ["8105.dict.yaml"].map((f) => loadfile(`../dic/${f}`)),
		groupDic: ["base.dict.yaml"].map((f) => loadfile(`../dic/${f}`)),
	});
}

export { xinit };
