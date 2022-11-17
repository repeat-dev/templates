export default {
	async cron(cron: Repeat.Cron, env: Repeat.Env): Promise<void> {
		// get lighthouse metrics for example.com
		const res = await env.browser.lighthouse('https://example.com');

		// log main metrics
		console.log(res.categories);

		// task: write metrics to env.metrics
	},
};
