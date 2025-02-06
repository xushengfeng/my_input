import { xinit } from "./load.ts";
import { inputTrans } from "../src/main.ts";
import { pinyin } from "npm:pinyin-pro";

import * as path from "jsr:@std/path";
import { walk } from "jsr:@std/fs/walk";

const segG = new Intl.Segmenter("zh-HANS", { granularity: "grapheme" });
const segW = new Intl.Segmenter("zh-HANS", { granularity: "word" });

xinit();

function splitTxt(
	txt: string,
	fn: (t: string) => string[],
	py: string[],
	op?: { firstBreak: boolean },
) {
	const l = fn(txt);
	let count = 0;
	let ideal = 0;
	let n = 0;
	for (const i of l) {
		const nextN = n + i.length;
		const p = py.slice(n, nextN).join("");
		let r: string[] = [];
		let pyLen = p.length;
		for (let j = op?.firstBreak ? 0 : p.length; j <= p.length; j++) {
			const _r = inputTrans(p.slice(0, j));
			if (_r.at(0) === i || j === p.length) {
				r = _r;
				pyLen = j;
				break;
			}
		}
		count += pyLen;
		ideal += p.length;
		const dis = r.indexOf(i);
		if (dis === -1) {
			if (p) count += i.length * 8; // uincode
		} else count += dis; // 假设只有一个候选，需要不断翻页，或者假设对比字的精力与击键相同
		count += 1;
		ideal += 1;

		n = nextN;
	}
	return { count, ideal, length: l.length };
}

function testFile(txt: string) {
	const py = pinyin(txt, { toneType: "none", type: "all" }).map(
		(i) => i.pinyin,
	);
	const zi = splitTxt(
		txt,
		(t) => Array.from(segG.segment(t)).map((i) => i.segment),
		py,
	);
	const ci = splitTxt(
		txt,
		(t) => Array.from(segW.segment(t)).map((i) => i.segment),
		py,
	);
	const cib = splitTxt(
		txt,
		(t) => Array.from(segW.segment(t)).map((i) => i.segment),
		py,
		{ firstBreak: true },
	);
	return { zi, ci, cib };
}

function item(zi: ReturnType<typeof splitTxt>) {
	return `${zi.count} ${(zi.count - zi.ideal) / zi.length}`;
}

const onlyFile = Deno.args.at(0);
const dirName = path.dirname(path.fromFileUrl(Deno.mainModule));
for await (const dirEntry of walk(path.join(dirName, "txt"))) {
	if (dirEntry.isFile) {
		console.log(dirEntry.name);
		if (onlyFile) if (onlyFile !== dirEntry.name) continue;
		const txt = Deno.readTextFileSync(dirEntry.path);
		const c = 5000;
		const max = Math.min(100_0000, txt.length);
		const zi: ReturnType<typeof splitTxt> = { count: 0, ideal: 0, length: 0 };
		const ci: ReturnType<typeof splitTxt> = { count: 0, ideal: 0, length: 0 };
		const cib: ReturnType<typeof splitTxt> = { count: 0, ideal: 0, length: 0 };
		for (let i = 0; i < max; i += c) {
			Deno.stdout.writeSync(new TextEncoder().encode(`\r${i / max}`));
			const x = testFile(txt.slice(i, i + c));
			for (const i in x.zi) {
				// @ts-ignore:
				zi[i] += x.zi[i];
			}
			for (const i in x.ci) {
				// @ts-ignore:
				ci[i] += x.ci[i];
			}
			for (const i in x.cib) {
				// @ts-ignore:
				cib[i] += x.cib[i];
			}
		}
		console.log("\n");
		console.table([
			[dirEntry.name, "字", "词", "词（提前返回）"],
			[max, item(zi), item(ci), item(cib)],
		]);
	}
}
