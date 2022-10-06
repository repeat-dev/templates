export default {
	async cron(cron: Repeat.Cron, env: Repeat.Env): Promise<void> {
		try {
			console.log('running cron job');
			// write cron task here

			// track success
			// metrics can be viewed in "Metrics tab"
			env.metrics.write('cron_processed', 1, 'success');
		} catch (e) {
			// log error
			console.error('cron failed!', e.message);

			// track failure
			env.metrics.write('cron_processed', 1, 'failure');
		}
	},
};
