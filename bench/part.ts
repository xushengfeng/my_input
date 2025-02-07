import { pinyin } from "npm:pinyin-pro";
import { split } from "../src/split.ts";
import { code2sen } from "../src/sen.ts";
import { xinit } from "../test/load.ts";

const { ziPinYin, allMap } = xinit();
const someKeys = ziPinYin;

const s = Deno.readTextFileSync("test/txt/百年孤独.txt");
const segS = new Intl.Segmenter("zh-HANS", { granularity: "sentence" });
const segW = new Intl.Segmenter("zh-HANS", { granularity: "sentence" });

const ww = Array.from(segS.segment(s)).map((i) => i.segment);
const w = Array.from(segW.segment(s)).map((i) => i.segment);

const wf = new Map<string, number>();
for (const [i, v] of w.entries()) {
	wf.set(v, i);
}

function randomPy() {
	const x = ww[Math.floor(Math.random() * ww.length)];
	const py = pinyin(x, { toneType: "none", type: "all" })
		.map((i) => i.pinyin)
		.join("");
	return py;
}

Deno.bench("split", (t) => {
	const py = randomPy();
	t.start();
	split(py, { alCodes: someKeys, alKeys: someKeys });
	t.end();
});

Deno.bench("sen", (t) => {
	const py = randomPy();
	const codes = split(py, { alCodes: someKeys, alKeys: someKeys });
	t.start();
	code2sen(codes, allMap, wf);
	t.end();
});
