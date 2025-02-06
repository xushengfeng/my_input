function code2sen(code: string[], map: Map<string, string[]>) {
	const l: string[] = [];
	function s(code: string[], str = "") {
		if (code.length === 0) {
			l.push(str);
			return;
		}
		for (let i = code.length; i > 0; i--) {
			const c = code.slice(0, i).join(" ");
			if (map.has(c)) {
				for (const v of map.get(c) || []) s(code.slice(i), str + v);
				break;
			}
		}
	}

	if (map.has(code.join(" "))) return map.get(code.join(" ")) as string[];
	s(code);
	return l.slice(0, 1);
}

export { code2sen };
