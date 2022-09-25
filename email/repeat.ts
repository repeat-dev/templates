export default {
	async webhook(request: Request, env: Repeat.Env, ctx: ExecutionContext) {
		// log headers
		const headers = Object.fromEntries(request.headers);
		console.log(headers);

		// write your webhook logic here

		return Response.json({ success: true });
	},
};
