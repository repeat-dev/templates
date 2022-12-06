export default {
	async cron(cron: Repeat.Cron, env: Repeat.Env): Promise<void> {
		const repeats = 1000;
		for (let i = 0; i < repeats; i++) {
			console.log('🎵 All I want for Christmas is you 🎶');
		}
	},
};
