export default {
	async webhook(request: Request, env: Repeat.Env): Promise<Response> {
		// parse the webhook URL
		const url = new URL(request.url);
		// get thr URL parameter
		const urlFromParams = url.searchParams.get('url');

		if (!urlFromParams) {
			return Response.json({ success: false, error: 'missing ?url parameter' }, { status: 400 });
		}

		// construct the storage key (url without protocol prefix)
		const reportStorageKey = `/lighthouse/${urlFromParams.substring(urlFromParams.indexOf('://') + 3)}/report.json`;

		// return stored report if exists
		const storedReport = await env.storage.get(reportStorageKey);
		if (storedReport) {
			return new Response(storedReport, { headers: { 'content-type': 'application/json' } });
		}

		// get lighthouse metrics for example.com
		const report = await env.browser.lighthouse(urlFromParams);
		await env.storage.put(reportStorageKey, JSON.stringify(report), { contentType: 'application/json' });

		// log main metrics
		console.log(report.categories);

		// return report
		return Response.json(report);
	},
};
