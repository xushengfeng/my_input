console.log("Server running at http://localhost:8000");
Deno.serve({ port: 8000 }, (req: Request) => {
	// 允许跨域
	const headers = new Headers({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	});

	// 解析请求参数
	const url = new URL(req.url);
	const input = url.searchParams.get("input") || "";

	// 模拟动态词库（可替换为数据库）
	const cloudDictionary: Record<
		string,
		Array<{ text: string; weight: number }>
	> = {
		ceshi: [
			{ text: "测试", weight: 1000 },
			{ text: "测市", weight: 800 },
		],
		yun: [
			{ text: "云", weight: 2000 },
			{ text: "运", weight: 1500 },
		],
	};

	console.log(req.body);

	// 返回匹配结果
	return new Response(
		JSON.stringify({ candidates: cloudDictionary[input] || [] }),
		{ headers },
	);
});
