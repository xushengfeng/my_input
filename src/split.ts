function main(keys: string, alKeys: string[]) {
	const l: string[] = [];
	const ak = alKeys
		.filter((i) => keys.includes(i))
		.toSorted((a, b) => b.length - a.length);

	function s(c: string) {
		if (c.length === 0) return;
		for (const i of ak) {
			if (c.startsWith(i)) {
				l.push(i);
				s(c.slice(i.length));
				return;
			}
		}
	}

	s(keys);
	return l;
}

export { main as split };
