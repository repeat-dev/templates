export default {
	async webhook(request: Request, env: Repeat.Env) {
		const url = new URL(request.url);

		// get the site from ?site parameter
		const site = url.searchParams.get('site') || 'https://example.com';

		// return website screenshot
		return env.browser.screenshot(site);
	},
};
