export default {
	async cron(cron: Repeat.Cron, env: Repeat.Env) {
		const result = await env.tools.lighthouse('https://docs.repeat.dev', { device: 'desktop' });
		console.log(result.categories);
		return Response.json(result);
	},

	async webhook(request: Request, env: Repeat.Env) {
		const url = new URL(request.url);
		const site = url.searchParams.get('site') || 'https://dash.repeat.dev';
		return await env.tools.screenshot(site, { device: 'mobile' });
	},
};
