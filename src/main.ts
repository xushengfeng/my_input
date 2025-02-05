import { loadDic } from "./dic.ts";
import { split } from "./split.ts";
import { code2sen } from "./sen.ts";

let baseMap: ReturnType<typeof loadDic>;
let groupMap: ReturnType<typeof loadDic>;
const allMap: ReturnType<typeof loadDic> = new Map();

function init(op: {
	baseDic: string[];
	groupDic?: string[];
}) {
	baseMap = loadDic(op.baseDic);
	groupMap = loadDic(op.groupDic ?? []);
	// console.log(baseMap, groupMap);
	for (const [k, v] of baseMap.entries()) allMap.set(k, v);
	for (const [k, v] of groupMap.entries()) allMap.set(k, v);
	return { baseMap, groupMap, allMap };
}

function main(keys: string) {
	const someKeys = Array.from(baseMap.keys() ?? []);
	// code -> codes
	// todo双拼
	// todo模糊
	// todo声母简拼
	const keycodes = [split(keys, someKeys)];
	console.log(keycodes);

	// codes -> words
	const fl: string[] = [];
	for (const i of keycodes) {
		fl.push(...code2sen(i, allMap));
	}

	// words -> words
	return fl;
}

export { main as inputTrans, init };
