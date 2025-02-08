import { xinit } from "./load.ts";
import { cleanYhData, inputTrans, yhXc } from "../src/main.ts";
import type { SenItem } from "../src/sen.ts";
import { pinyin } from "npm:pinyin-pro";

import * as path from "jsr:@std/path";
import { walk } from "jsr:@std/fs/walk";

const segG = new Intl.Segmenter("zh-HANS", { granularity: "grapheme" });
const segW = new Intl.Segmenter("zh-HANS", { granularity: "word" });

xinit();

yhXc; // 用于调试

function getPinyin(txt: string) {
	return pinyin(txt, { toneType: "none", type: "all", v: true });
}

function splitTxt(
	l: string[],
	py: string[],
	op?: { firstBreak?: boolean; devB?: boolean },
) {
	let count = 0;
	let ideal = 0;
	let n = 0;
	let senL: { s: string; r: string[]; i: number }[] = [];

	function select(
		r: SenItem[],
		txt: string,
		py: string,
		s: (x: number) => void,
	) {
		const dis = r.findIndex((i) => i.txt === txt);
		if (dis === -1) {
			const fi = r.findIndex((i) => txt.startsWith(i.txt));
			const f = r[fi];
			senL.push({ s: txt, r: r.map((i) => i.txt), i: fi });
			if (!f) {
				count += txt.length * 9; // uincode
				return;
			}
			s(fi);
			count += 1 + fi;
			const npy = py.slice(f.end);
			const nout = inputTrans(npy);
			select(nout.all, txt.slice(f.txt.length), npy, nout.select);
		} else {
			s(dis);
			senL.push({ s: txt, r: r.map((i) => i.txt), i: dis });
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
		let s: (x: number) => void = () => {};
		for (let j = op?.firstBreak ? 0 : p.length; j <= p.length; j++) {
			const _r = inputTrans(p.slice(0, j));
			if (_r.all.at(0)?.txt === i || j === p.length) {
				r = _r.all;
				pyLen = j;
				s = _r.select;
				break;
			}
		}
		count += pyLen;
		ideal += p.length;

		senL = [];

		select(r, i, p, s);

		ideal += 1;
	}

	return { count, ideal, length: l.length };
}

function testX() {
	const txt = "天啊，这个也太厉害了吧";

	const py = getPinyin(txt).map((i) => i.pinyin);
	const x = splitTxt([txt], py);
	console.log(x);
}

function getPinYinList(txt: string) {
	const _py = getPinyin(txt).map((i) => ({
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

	return { s, py };
}

function item(zi: ReturnType<typeof splitTxt>, all: number) {
	return `${zi.count}\n  ${(zi.count - zi.ideal) / all}\n`;
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
		const l: {
			name: string;
			l: ReturnType<typeof splitTxt>;
			f: (s: string[]) => string[];
			op?: { firstBreak?: boolean; devB?: boolean };
		}[] = [
			{
				name: "字",
				l: { count: 0, ideal: 0, length: 0 },
				f: (s) =>
					s.flatMap((t) => Array.from(segG.segment(t)).map((i) => i.segment)),
			},
			{
				name: "词",
				l: { count: 0, ideal: 0, length: 0 },
				f: (s) =>
					s.flatMap((t) => Array.from(segW.segment(t)).map((i) => i.segment)),
			},
			{
				name: "词（提前返回）",
				l: { count: 0, ideal: 0, length: 0 },
				f: (s) =>
					s.flatMap((t) => Array.from(segW.segment(t)).map((i) => i.segment)),
				op: { firstBreak: true },
			},
			{ name: "句", l: { count: 0, ideal: 0, length: 0 }, f: (s) => s },
		];

		console.log(max);

		for (const [mi, n] of l.entries()) {
			cleanYhData();
			for (let i = 0; i < max; i += c) {
				Deno.stdout.writeSync(
					new TextEncoder().encode(
						`\r${(i / max).toString().padEnd(20, "0")}  ${mi / l.length}`,
					),
				);
				const v = getPinYinList(txt.slice(i, i + c)); // 我们必须想象拼音库是快的
				const x = splitTxt(n.f(v.s), v.py);
				for (const i in x) {
					// @ts-ignore:
					n.l[i] += x[i];
				}
			}
			console.log("\n");
			console.log(n.name, item(n.l, max));
		}
	}
}
