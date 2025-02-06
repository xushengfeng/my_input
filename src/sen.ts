import type { CodeItem } from "./split.ts";

type SenItem = { txt: string; start: number; end: number };

function code2sen(code: CodeItem[], map: Map<string, string[]>) {
	const l: string[] = [];
	const start = code.at(0)?.start ?? 0;
	const end = code.at(-1)?.end ?? 0;

	function s(code: CodeItem[], str = "") {
		if (code.length === 0) {
			l.push(str);
			return;
		}
		for (let i = code.length; i > 0; i--) {
			const c = Codes2DicKey(code.slice(0, i));
			if (map.has(c)) {
				for (const v of map.get(c) || []) s(code.slice(i), str + v);
				break;
			}
		}
	}

	if (map.has(Codes2DicKey(code)))
		return map.get(Codes2DicKey(code))?.map((i) => ({
			txt: i,
			start: start,
			end: end,
		})) as SenItem[];
	s(code);
	return l.slice(0, 1).map((i) => ({
		txt: i,
		start: start,
		end: end,
	})) as SenItem[];
}

function Codes2DicKey(code: CodeItem[]) {
	return code.map((i) => i.code).join(" ");
}

export { code2sen, type SenItem };
