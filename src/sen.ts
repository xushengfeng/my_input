import type { Pinyin, ZiCiJu } from "./main.ts";
import type { CodeItem } from "./split.ts";

type SenItem = { txt: ZiCiJu; start: number; end: number; words?: ZiCiJu[] };

function code2sen(
	_codes: CodeItem[][],
	map: Map<Pinyin, ZiCiJu[]>,
	op?: {
		wordFeq?: Map<ZiCiJu, number>;
	},
) {
	if (_codes.length === 0) return [];

	const codes = _codes.slice(0, 4);
	const l: SenItem[] = [];
	const { start, end } = codesIndex(codes.at(0) ?? []);

	function sort<T extends { w: number }>(l: T[]) {
		return l.toSorted((a, b) => b.w - a.w);
	}

	function getW(c: Pinyin) {
		const l = map.get(c);
		if (!l) return;
		const x: { t: ZiCiJu; w: number }[] = [];
		for (const i of l) {
			const f = op?.wordFeq?.get(i);
			x.push({ t: i, w: f ?? 0 });
		}
		return sort(x);
	}

	function s(code: CodeItem[], str: ZiCiJu[]) {
		if (code.length === 0) {
			if (str.length <= 1) return;
			l.push({ txt: str.join("") as ZiCiJu, start, end, words: str });
			return;
		}
		ll: for (let i = code.length; i > 0; i--) {
			for (const c of posiDicKey(code.slice(0, i))) {
				const v = getW(c)?.at(0);
				if (v) {
					str.push(v.t);
					s(code.slice(i), str);
					break ll;
				}
			}
		}
	}

	const _g = codes.flatMap((code) =>
		posiDicKey(code).flatMap((c) => getW(c) ?? []),
	);
	l.push(
		...sort(_g).map((i) => ({
			txt: i.t,
			start: start,
			end: end,
		})),
	);

	const needLongI = codes.findIndex((code) => code.length > 1);
	if (needLongI > -1) {
		if (needLongI === 0) s(codes[needLongI], []);
		const xl: { txt: ZiCiJu; w: number; start: number; end: number }[] = [];
		const pySet = new Set<string>();
		for (const code of codes) {
			const firstWordLength = Math.min(3, code.length - 1); // -1排除_g
			for (let i = firstWordLength; i > 0; i--) {
				const codeSlice = code.slice(0, i);
				for (const c of posiDicKey(codeSlice)) {
					if (pySet.has(c)) continue; // c唯一表示code和i唯一
					pySet.add(c);
					for (const v of getW(c) || [])
						xl.push({ txt: v.t, w: v.w, ...codesIndex(codeSlice) });
				}
			}
		}
		for (const i of xl.toSorted((a, b) => b.w - a.w)) {
			l.push({ txt: i.txt, start: i.start, end: i.end });
		}
	}

	return l;
}

function Codes2DicKey(code: Pinyin[]) {
	return code.join(" ") as Pinyin;
}

function posiA<T>(l: T[][]) {
	if (l.every((i) => i.length === 1)) return [l.map((i) => i[0])];
	// todo 性能
	const x: T[][] = [];
	function s(_l: T[], _i: number) {
		const posi = l.at(_i);
		if (!posi) {
			x.push(_l);
			return;
		}
		for (const i of posi) {
			const nl = structuredClone(_l);
			nl.push(i);
			s(nl, _i + 1);
		}
	}
	s([], 0);
	return x;
}

function posiDicKey(code: CodeItem[]) {
	// todo 限制
	// todo 权重
	const l = code.map((i) => i.code);
	const x = posiA(l);
	return x.map((i) => Codes2DicKey(i));
}

function codesIndex(code: CodeItem[]) {
	const start = code.at(0)?.start ?? 0;
	const end = code.at(-1)?.end ?? 0;
	return { start, end };
}

export { code2sen, type SenItem };
