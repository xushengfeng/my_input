import { xinit } from "./load.ts";
import { inputTrans } from "../src/main.ts";
import { pinyin } from "npm:pinyin-pro";

const segG = new Intl.Segmenter("zh-HANS", { granularity: "grapheme" });
const segW = new Intl.Segmenter("zh-HANS", { granularity: "word" });

xinit();

function splitTxt(txt: string, fn: (t: string) => string[], py: string[]) {
	const l = fn(txt);
	let count = 0;
	let ideal = 0;
	let n = 0;
	for (const i of l) {
		const nextN = n + i.length;
		const p = py.slice(n, nextN).join("");
		count += p.length;
		ideal += p.length + 1;
		const r = inputTrans(p); // todo 这里假设打完全部，但可以提前结束
		const dis = r.indexOf(i);
		if (dis === -1) {
			if (p) count += i.length * 8; // uincode
		} else count += dis; // 假设只有一个候选，需要不断翻页，或者假设对比字的精力与击键相同
		count += 1;

		n = nextN;
	}
	console.log(txt.length, count, ideal);
	return { count, ideal };
}

for (const i of ["你好,世界"]) {
	const py = pinyin(i, { toneType: "none", type: "all" }).map((i) => i.pinyin);
	splitTxt(i, (t) => Array.from(segG.segment(t)).map((i) => i.segment), py);
	splitTxt(i, (t) => Array.from(segW.segment(t)).map((i) => i.segment), py);
}
