import { xinit } from "./load.ts";
import { inputTrans } from "../src/main.ts";
import type { SenItem } from "../src/sen.ts";
import { pinyin } from "npm:pinyin-pro";

import * as path from "jsr:@std/path";
import { walk } from "jsr:@std/fs/walk";

const segG = new Intl.Segmenter("zh-HANS", { granularity: "grapheme" });
const segW = new Intl.Segmenter("zh-HANS", { granularity: "word" });

xinit();

function splitTxt(l: string[], py: string[], op?: { firstBreak: boolean }) {
	let count = 0;
	let ideal = 0;
	let n = 0;

	function select(r: SenItem[], txt: string, py: string) {
		const dis = r.findIndex((i) => i.txt === txt);
		if (dis === -1) {
			const fi = r.findIndex((i) => txt.startsWith(i.txt));
			const f = r[fi];
			if (!f) {
				count += txt.length * 9; // uincode
				return;
			}
			count += 1 + fi;
			const npy = py.slice(f.end);
			const nout = inputTrans(npy).all;
			select(nout, txt.slice(f.txt.length), npy);
		} else {
			count += dis + 1; // 假设只有一个候选，需要不断翻页，或者假设对比字的精力与击键相同
		}
	}

	for (const i of l) {
		const nextN = n + i.length;
		const oldN = n;
		n = nextN;
		const p = py.slice(oldN, nextN).join("");
		if (!p) {
			count += 1;
			ideal += 1;
			continue;
		}
		let r: SenItem[] = [];
		let pyLen = p.length;
		for (let j = op?.firstBreak ? 0 : p.length; j <= p.length; j++) {
			const _r = inputTrans(p.slice(0, j)).all;
			if (_r.at(0)?.txt === i || j === p.length) {
				r = _r;
				pyLen = j;
				break;
			}
		}
		count += pyLen;
		ideal += p.length;

		select(r, i, p);

		ideal += 1;
	}
	return { count, ideal, length: l.length };
}

function testX() {
	const txt = "天啊，这个也太厉害了吧";

	const py = pinyin(txt, { toneType: "none", type: "all" }).map(
		(i) => i.pinyin,
	);
	const x = splitTxt([txt], py);
	console.log(x);
}

function testFile(txt: string) {
	const _py = pinyin(txt, { toneType: "none", type: "all" }).map((i) => ({
		py: i.pinyin,
		t: i.origin,
	}));
	const py = _py.map((i) => i.py);

	const s: string[] = [];
	let lastType: "w" | "n" = "n";
	for (const i of _py) {
		if (i.py)
			if (lastType === "n") {
				s.push(i.t);
			} else {
				const l = s.length - 1;
				if (s[l]) s[l] = s[l] + i.t;
			}
		else s.push(i.t);
		lastType = i.py ? "w" : "n";
	}

	const zi = splitTxt(
		s.flatMap((t) => Array.from(segG.segment(t)).map((i) => i.segment)),
		py,
	);
	const ci = splitTxt(
		s.flatMap((t) => Array.from(segW.segment(t)).map((i) => i.segment)),
		py,
	);
	const cib = splitTxt(
		s.flatMap((t) => Array.from(segW.segment(t)).map((i) => i.segment)),
		py,
		{ firstBreak: true },
	);
	const jz = splitTxt(
		s,
		py,
		// { firstBreak: true },
	);
	return { zi, ci, cib, jz };
}

function item(zi: ReturnType<typeof splitTxt>) {
	return `${zi.count} ${(zi.count - zi.ideal) / zi.length}`;
}

testX();

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
		const jz: ReturnType<typeof splitTxt> = { count: 0, ideal: 0, length: 0 };
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
			for (const i in x.jz) {
				// @ts-ignore:
				jz[i] += x.jz[i];
			}
		}
		console.log("\n");
		console.table([
			[dirEntry.name, "字", "词", "词（提前返回）", "句子"],
			[max, item(zi), item(ci), item(cib), item(jz)],
		]);
	}
}
