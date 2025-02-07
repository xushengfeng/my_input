const w = new Set<string>();

const s = Deno.readTextFileSync("test/txt/百年孤独.txt");
const segW = new Intl.Segmenter("zh-HANS", { granularity: "word" });
for (const i of segW.segment(s)) {
	w.add(i.segment);
}

const ww = Array.from(w);

const tm = new Map<string, number>();
let ms = 0;
const ts = new Set<string>();

const m = new Map<string, number>();
let i = 0;
for (const v of w) {
	m.set(v, i);
	i++;
}

Deno.bench("add set", (t) => {
	const x = ww[Math.floor(Math.random() * ww.length)];
	t.start();
	ts.add(x);
	Array.from(ts);
	t.end();
});
Deno.bench("add map", (t) => {
	const x = ww[Math.floor(Math.random() * ww.length)];
	t.start();
	tm.set(x, ms);
	ms++;
	t.end();
});

Deno.bench("array", (t) => {
	const x = ww[Math.floor(Math.random() * ww.length)];
	t.start();
	ww.indexOf(x);
	t.end();
});

Deno.bench("map", (t) => {
	const x = ww[Math.floor(Math.random() * ww.length)];
	t.start();
	m.get(x);
	t.end();
});
