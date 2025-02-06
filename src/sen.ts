import type { CodeItem } from "./split.ts";

type SenItem = { txt: string; start: number; end: number };

function code2sen(code: CodeItem[], map: Map<string, string[]>) {
	if (code.length === 0) return [];

	const l: SenItem[] = [];
	const { start, end } = codesIndex(code);

	function s(code: CodeItem[], str = "") {
		if (code.length === 0) {
			l.push({ txt: str, start, end });
			return;
		}
		for (let i = code.length; i > 0; i--) {
			const c = Codes2DicKey(code.slice(0, i));
			if (map.has(c)) {
				const v = map.get(c)?.at(0);
				if (v) s(code.slice(i), str + v);
				break;
			}
		}
	}

	const _g = map.get(Codes2DicKey(code));
	if (_g)
		l.push(
			..._g.map((i) => ({
				txt: i,
				start: start,
				end: end,
			})),
		);

	if (code.length > 1) {
		s(code);
		const firstWordLength = Math.min(3, code.length);
		for (let i = firstWordLength; i > 0; i--) {
			const codeSlice = code.slice(0, i);
			const c = Codes2DicKey(codeSlice);
			if (map.has(c)) {
				for (const v of map.get(c) || [])
					l.push({ txt: v, ...codesIndex(codeSlice) });
			}
		}
	}

	return l;
}

function Codes2DicKey(code: CodeItem[]) {
	return code.map((i) => i.code).join(" ");
}

function codesIndex(code: CodeItem[]) {
	const start = code.at(0)?.start ?? 0;
	const end = code.at(-1)?.end ?? 0;
	return { start, end };
}

export { code2sen, type SenItem };
