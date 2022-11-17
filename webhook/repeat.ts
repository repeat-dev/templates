export default {
	async webhook(request: Request, env: Repeat.Env) {
		console.log('incoming request', `${request.method} ${request.url}`);

		// write your webhook logic here

		return Response.json({ success: true });
	},
};
