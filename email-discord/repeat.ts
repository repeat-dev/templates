export default {
	async email(email: Repeat.Email, env: Repeat.Env) {
		console.log('New email received:', email);

		// You can parse the body to extract what you are interested in only.
		const body = email.bodies['text/plain'] || email.bodies['text/html'];

		// Construct Discord message, undefined email attribute is filtered from fields
		const message: Webhooks.Discord.Payload = {
			avatar_url: 'https://dash.repeat.dev/logo.jpg',
			username: 'repeat.dev',
			content: ':mailbox: New email received!',
			embeds: [
				{
					title: 'Metadata',
					fields: [
						email.subject
							? {
									name: 'Subject',
									value: email.subject,
							  }
							: undefined,
						email.from
							? {
									name: 'From',
									value: email.from,
									inline: true,
							  }
							: undefined,
						email.to
							? {
									name: 'To',
									value: email.to,
									inline: true,
							  }
							: undefined,
						email.cc
							? {
									name: 'CC',
									value: email.cc,
									inline: true,
							  }
							: undefined,
						email.bcc
							? {
									name: 'BCC',
									value: email.bcc,
									inline: true,
							  }
							: undefined,
					].filter(Boolean),
					timestamp: new Date().toISOString(),
				},
				{
					title: 'Body',
					description: body.substring(0, 4095),
					color: null,
				},
			],
		};

		await env.webhooks.discord(env.variables.WEBHOOK_SECRET, message);
	},
};
