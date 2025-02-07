import { loadDic } from "./dic.ts";
import { split } from "./split.ts";
import { code2sen, type SenItem } from "./sen.ts";

let baseMap: ReturnType<typeof loadDic>;
let groupMap: ReturnType<typeof loadDic>;
const allMap = new Map<string, string[]>();
let keyMapCode: Record<string, string> = {};
let codeExt: Record<string, string> = {};

const yhXc = new Map<string, number>();
const yhXcGx = new Map<string, Set<string>>();
let lastTxt = "";
let wordFeqI = 0;

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
		fl.push(...code2sen(i, allMap, yhXc)); // todo 这里交错了 去重
	}

	// words -> words
	return {
		all: fl,
		pureText: fl.map((i) => i.txt),
		select(i: number) {
			const data = fl.at(i);
			if (!data) return;
			yhXc.delete(data.txt);
			yhXc.set(data.txt, wordFeqI);
			wordFeqI++;
			if (lastTxt) {
				const l = yhXcGx.get(lastTxt);
				if (l) l.add(data.txt);
				else yhXcGx.set(lastTxt, new Set([data.txt]));
			}
			lastTxt = data.txt;
			return data;
		},
	};
}

function exportYhData() {
	const obj: Record<string, string[]> = {};
	for (const [k, v] of yhXcGx) {
		obj[k] = Array.from(v);
	}
	return { s: Array.from(yhXc), c: obj };
}

function cleanYhData() {
	yhXc.clear();
	yhXcGx.clear();
	wordFeqI = 0;
}

export { main as inputTrans, init, exportYhData, cleanYhData };
