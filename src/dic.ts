function parseDic(data: string) {
	const x: { t: string; k: string; w: number }[] = [];
	const l = data
		.split("\n")
		.filter((i) => !i.startsWith("#") && i.includes("\t"));
	for (const i of l) {
		const xl = i.split("\t");
		const firstK = xl.at(0);
		if (!firstK) continue;
		const t = firstK;
		const nextK = xl.at(1);
		let k = " ";
		if (Number.isNaN(Number(nextK))) k = nextK || " "; // todo 自动注音
		const lastK = xl.at(-1);
		const w = Number(lastK) || 0;
		x.push({ w, k, t });
	}
	return x;
}

function loadDic(datas: string[]) {
	const dicMap = new Map<string, string[]>();
	for (const data of datas) {
		const parse = parseDic(data);
		for (const x of parse) {
			const v = dicMap.get(x.k);
			if (v) v.push(x.t);
			else dicMap.set(x.k, [x.t]);
		}
	}
	return dicMap;
}

export { loadDic };
