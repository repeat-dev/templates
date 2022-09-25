export default {
	async webhook(request: Request, env: Repeat.Env, ctx: ExecutionContext) {
		if (request.headers.get('x-webhook-secret') !== env.variables.WEBHOOK_SECRET) {
			return Response.json({ success: false, error: 'invalid webhook secret' }, { status: 401 });
		}

		// write your webhook logic here

		return Response.json({ success: true });
	},
};
