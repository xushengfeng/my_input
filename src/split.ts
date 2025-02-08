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
	const posi = new Map<number, string[]>();
	const pyW = new Map<string, number>();
	const tasks: { c: CodeItem[]; w: number; lastI: number }[] = [
		{ c: [], lastI: 0, w: 0 },
	];
	const maxTasks = 4;
	const codeExt = op.codeExt;

	for (const [nw, i] of op.alCodes.entries()) {
		const x = keys.indexOf(i);
		if (x !== -1) {
			pyW.set(i, op.alCodes.length - nw);
			const l = posi.get(x) ?? [];
			l.push(i);
			posi.set(x, l);
		}
	}
	for (let x = 0; x < keys.length; x++) {
		if (tasks.every((i) => x < i.lastI)) continue;
		let l = posi.get(x);
		if (!l) {
			for (const n of pyW.keys()) {
				if (keys.slice(x, x + n.length) === n) {
					if (l) l.push(n);
					else l = [n];
					posi.set(x, l);
				}
			}
			if (!l) {
				const tt = tasks.filter((i) => i.lastI <= x);
				for (const t of tt) {
					t.c.push({ code: [keys.slice(x, x + 1)], start: x, end: x + 1 });
					t.lastI = x + 1;
				} // todo 简拼
				continue;
			}
		}
		l = l.toSorted((a, b) => b.length - a.length);
		const tt = tasks.filter((i) => i.lastI <= x);
		for (const [i, v] of l.entries()) {
			if (i === 0)
				for (const t of tt) {
					t.c.push({ code: [v], start: x, end: x + v.length });
					t.lastI = x + v.length;
				}
			else {
				for (const t of tt) {
					if (tasks.length >= maxTasks) break;
					const nt = structuredClone(t);
					nt.c.pop();
					nt.c.push({ code: [v], start: x, end: x + v.length });
					nt.lastI = x + v.length;
					tasks.push(nt);
				}
			}
		}
	}
	for (const t of tasks) {
		let w = 0;
		for (const c of t.c) {
			w += pyW.get(c.code[0]) ?? 0;
		}
		t.w = w;
	}

	for (const t of tasks) {
		l.push({ c: t.c, w: t.w });
	}

	for (const i of l) {
		if (codeExt)
			for (const x of i.c) {
				x.code = extCode(x.code, codeExt);
			}
	}
	const ff = l.toSorted((a, b) => a.c.length - b.c.length || b.w - a.w);
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
