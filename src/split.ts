type CodeItem = { code: string; start: number; end: number };

function main(
	keys: string,
	op: {
		alKeys?: string[];
		alCodes: string[];
		keyMapCode?: Record<string, string>;
		codeExt?: Record<string, string>;
	},
) {
	const l: CodeItem[] = [];
	const ak = op.alCodes
		.filter((i) => keys.includes(i))
		.toSorted((a, b) => b.length - a.length);

	function s(c: string, start: number) {
		if (c.length === 0) return;
		for (const i of ak) {
			if (c.startsWith(i)) {
				l.push({ code: i, start, end: start + i.length });
				s(c.slice(i.length), start + i.length);
				return;
			}
		}
	}

	s(keys, 0);
	const f = op.codeExt ? extCode(l, op.codeExt) : [l];
	const ff = f.filter((i) => i.every((x) => op.alCodes.includes(x.code)));
	return ff;
}
function generateCombinations<T>(arr: T[]) {
	const result: T[][] = [];
	const n = arr.length;
	const total = 1 << n; // 计算2的n次方

	for (let i = 0; i < total; i++) {
		const subset = [];
		for (let j = 0; j < n; j++) {
			// 检查第j位是否为1，决定是否包含对应元素
			if (i & (1 << j)) {
				subset.push(arr[j]);
			}
		}
		result.push(subset);
	}

	return result;
}
function extCode(code: CodeItem[], codeExt: Record<string, string>) {
	const f: CodeItem[][] = [];
	const k: [number, string][] = [];
	all: for (const [n, i] of code.entries()) {
		for (const r in codeExt) {
			const re = new RegExp(r);
			if (re.test(i.code)) {
				if (k.length < 3) k.push([n, r]);
				else break all;
			}
		}
	}
	const x = generateCombinations(k);
	for (const _i of x) {
		const l = structuredClone(code);
		for (const i of _i) {
			l[i[0]].code = l[i[0]].code.replace(new RegExp(i[1]), codeExt[i[1]]);
		}
		f.push(l);
	}
	return f;
}

export { main as split, type CodeItem };
