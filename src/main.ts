import { loadDic } from "./dic.ts";
import { split } from "./split.ts";
import { code2sen, type SenItem } from "./sen.ts";

let baseMap: ReturnType<typeof loadDic>;
let groupMap: ReturnType<typeof loadDic>;
const allMap = new Map<string, string[]>();
const szmMap = new Map<string, string[]>(); // 首字母简拼
let ziPinYin: string[] = [];
let keyMapCode: Record<string, string> = {};
let codeExt: Record<string, string> = {};

const yhXc = new Map<string, number>();
const yhXcGx = new Map<string, Set<string>>();
let lastTxt = "";
let wordFeqI = 0;

function sumPyW(x: { t: string; w: number }[]) {
	let w = 0;
	for (const i of x) {
		w += i.w;
	}
	return w;
}

function init(op: {
	baseDic: string[];
	groupDic?: string[];
}) {
	baseMap = loadDic(op.baseDic);
	groupMap = loadDic(op.groupDic ?? []);
	ziPinYin = Array.from(baseMap.keys() ?? []).toSorted(
		(a, b) => sumPyW(baseMap.get(b) ?? []) - sumPyW(baseMap.get(a) ?? []),
	);
	// console.log(baseMap, groupMap);
	for (const [k, v] of baseMap.entries())
		allMap.set(
			k,
			v.toSorted((a, b) => b.w - a.w).map((i) => i.t),
		);
	for (const k of baseMap.keys()) {
		for (let i = 0; i < k.length; i++) {
			const nk = k.slice(0, i + 1);
			const vv = szmMap.get(nk) ?? [];
			vv.push(k);
			szmMap.set(nk, vv);
		}
	}
	for (const [k, v] of szmMap) {
		const nl = v.toSorted(
			(a, b) => sumPyW(baseMap.get(b) ?? []) - sumPyW(baseMap.get(a) ?? []),
		);
		szmMap.set(k, nl);
	}
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
	return { baseMap, groupMap, allMap, szmMap, ziPinYin, keyMapCode, codeExt };
}

function main(keys: string) {
	const someKeys = ziPinYin;
	// keys -> codes
	// todo双拼
	const codes = split(keys, {
		alCodes: someKeys,
		alKeys: someKeys,
		// codeExt,
		keyMapCode,
		partKeys: szmMap,
	});
	// console.log(codes);

	// codes -> words
	const fl: SenItem[] = code2sen(codes, allMap, { wordFeq: yhXc });

	// words -> words
	return {
		all: fl,
		pureText: fl.map((i) => i.txt),
		select(i: number) {
			const data = fl.at(i);
			if (!data) return;
			for (const i of data.words ?? [data.txt]) {
				addWord(i);
			}
			return data;
		},
	};
}

function addWord(txt: string) {
	yhXc.delete(txt);
	yhXc.set(txt, wordFeqI);
	wordFeqI++;
	if (lastTxt) {
		const l = yhXcGx.get(lastTxt);
		if (l) l.add(txt);
		else yhXcGx.set(lastTxt, new Set([txt]));
	}
	lastTxt = txt;
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

export { main as inputTrans, init, exportYhData, cleanYhData, yhXc };
