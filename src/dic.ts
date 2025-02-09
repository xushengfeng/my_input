import type { Pinyin, ZiCiJu } from "./main.ts";

function parseDic(data: string) {
	const x: { t: ZiCiJu; k: Pinyin; w: number }[] = [];
	const l = data
		.split("\n")
		.filter((i) => !i.startsWith("#") && i.includes("\t"));
	for (const i of l) {
		const xl = i.split("\t");
		const firstK = xl.at(0);
		if (!firstK) continue;
		const t = firstK as ZiCiJu;
		const nextK = xl.at(1) as Pinyin;
		let k = " " as Pinyin;
		if (Number.isNaN(Number(nextK))) k = nextK || (" " as Pinyin); // todo 自动注音
		const lastK = xl.at(-1);
		const w = Number(lastK) || 100;
		x.push({ w, k, t });
	}
	return x;
}

function loadDic(datas: string[]) {
	const dicMap = new Map<Pinyin, { t: ZiCiJu; w: number }[]>();
	for (const data of datas) {
		const parse = parseDic(data);
		for (const x of parse) {
			const v = dicMap.get(x.k);
			if (v) v.push({ t: x.t, w: x.w });
			else dicMap.set(x.k, [{ t: x.t, w: x.w }]);
		}
	}
	return dicMap;
}

export { loadDic };
