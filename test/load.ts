import { loadfile } from "../x/load_file.ts";
import { init } from "../src/main.ts";

function xinit() {
	return init({
		baseDic: [loadfile("../dic/8105.dict.yaml")],
		groupDic: [loadfile("../dic/base.dict.yaml")],
	});
}

export { xinit };
