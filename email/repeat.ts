export default {
	async email(email: Request, env: Repeat.Env, ctx: ExecutionContext) {
		// log email
		console.log(email);

		// write your email logic here
		// todo: showcase integrations (slack/discord)
	},
};
