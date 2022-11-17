export default {
	async webhook(request: Request, env: Repeat.Env) {
		console.log('incoming request', `${request.method} ${request.url}`);

		// write request to metrics, label with request method
		env.metrics.write('request', 1, request.method);

		// you can add WEBHOOK_SECRET variable in settings
		if (request.headers.get('x-webhook-secret') !== env.variables.WEBHOOK_SECRET) {
			// write failed auth
			env.metrics.write('request_auth_failed', 1);

			// log to console
			console.warn('invalid webhook secret');
			return Response.json({ success: false, error: 'invalid webhook secret' }, { status: 401 });
		}

		// write your webhook logic here

		return Response.json({ success: true });
	},
};
