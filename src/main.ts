import { loadDic } from "./dic.ts";
import { split } from "./split.ts";
import { code2sen, type SenItem } from "./sen.ts";

let baseMap: ReturnType<typeof loadDic>;
let groupMap: ReturnType<typeof loadDic>;
const allMap = new Map<string, string[]>();
let keyMapCode: Record<string, string> = {};
let codeExt: Record<string, string> = {};

function init(op: {
	baseDic: string[];
	groupDic?: string[];
}) {
	baseMap = loadDic(op.baseDic);
	groupMap = loadDic(op.groupDic ?? []);
	// console.log(baseMap, groupMap);
	for (const [k, v] of baseMap.entries())
		allMap.set(
			k,
			v.toSorted((a, b) => b.w - a.w).map((i) => i.t),
		);
	for (const [k, v] of groupMap.entries())
		allMap.set(
			k,
			v.toSorted((a, b) => b.w - a.w).map((i) => i.t),
		);
	keyMapCode = {};
	codeExt = {
		ang$: "an",
		an$: "ang",
		eng$: "en",
		en$: "eng",
		ing$: "in",
		in$: "ing",
		"^sh(?=[aeiou])": "s",
		"^s(?=[aeiou])": "sh",
		"^ch(?=[aeiou])": "c",
		"^c(?=[aeiou])": "ch",
		"^zh(?=[aeiou])": "z",
		"^z(?=[aeiou])": "zh",
	};
	return { baseMap, groupMap, allMap, keyMapCode, codeExt };
}

function main(keys: string) {
	const someKeys = Array.from(baseMap.keys() ?? []);
	// keys -> codes
	// todo双拼
	// todo声母简拼
	const codes = split(keys, {
		alCodes: someKeys,
		alKeys: someKeys,
		codeExt,
		keyMapCode,
	});
	// console.log(codes);

	// codes -> words
	const fl: SenItem[] = [];
	for (const i of codes) {
		fl.push(...code2sen(i, allMap)); // todo 这里交错了 去重
	}

	// words -> words
	return { all: fl, pureText: fl.map((i) => i.txt) };
}

export { main as inputTrans, init };
