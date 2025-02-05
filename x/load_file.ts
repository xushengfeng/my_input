import * as path from "jsr:@std/path";

function loadfile(p: string) {
	const dirName = path.dirname(path.fromFileUrl(Deno.mainModule));
	const data = Deno.readTextFileSync(path.join(dirName, p));
	return data;
}

export { loadfile };
