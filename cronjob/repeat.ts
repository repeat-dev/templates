export default {
	async cron(cron: Repeat.Cron, env: Repeat.Env, ctx: ExecutionContext): Promise<void> {
		try {
			// write cron task here

			// track success
			env.metrics.write('cron_processed', 1, 'success');
		} catch (e) {
			// log error
			console.error('Cron failed!', e.message);

			// track failure
			env.metrics.write('cron_processed', 1, 'failure');
		}
	},
};
