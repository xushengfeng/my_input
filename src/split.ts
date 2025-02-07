type CodeItem = { code: string[]; start: number; end: number };

function main(
	keys: string,
	op: {
		alKeys?: string[];
		alCodes: string[];
		keyMapCode?: Record<string, string>;
		codeExt?: Record<string, string>;
	},
) {
	const l: { c: CodeItem[]; w: number }[] = [];
	const ak = op.alCodes.filter((i) => keys.includes(i));
	const codeExt = op.codeExt;

	function xs() {
		const nl: CodeItem[] = [];
		let w = 0;
		out: for (let x = 0; x < keys.length; x++) {
			for (const [n, i] of ak.entries()) {
				const k = keys.slice(x, x + i.length);
				if (k === i) {
					nl.push({ code: [i], start: x, end: x + i.length });
					w += n;
					x += i.length - 1;
					continue out;
				}
			}
		}
		return { c: nl, w };
	}

	l.push(xs());

	for (const i of l) {
		if (codeExt)
			for (const x of i.c) {
				x.code = extCode(x.code, codeExt);
			}
	}
	const ff = l
		.filter((i) =>
			i.c.every((x) => x.code.every((x) => op.alCodes.includes(x))),
		)
		.toSorted((a, b) => a.c.length - b.c.length || b.w - a.w);
	return ff.map((i) => i.c);
}
function extCode(code: string[], codeExt: Record<string, string>) {
	const k: string[] = [];
	for (const i of code) {
		k.push(i);
		for (const r in codeExt) {
			const re = new RegExp(r);
			if (re.test(i)) {
				k.push(i.replace(re, codeExt[r]));
			}
		}
	}
	return k;
}

export { main as split, type CodeItem };
