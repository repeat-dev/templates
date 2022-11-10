// Set WEBHOOK_SECRET in Variables 👉

// list of headers to hide value for
const redactedHeaders = ['authorization', 'cf-connecting-ip', 'x-real-ip'];

export default {
	async webhook(request: Request, env: Repeat.Env) {
		// clone, parse and send request to Discord
		const requestCloned = request.clone();
		await requestToDiscord(requestCloned, env);

		// do something with original request as you please
		// await fetch("https://my-service.example.com", request)
	},
};

async function requestToDiscord(request: Request, env: Repeat.Env) {
	const url = new URL(request.url);
	let searchParamsFormatted = '';
	let headersFormatted = '';

	// format search params
	url.searchParams.forEach((value, key) => {
		searchParamsFormatted += `${key} = ${value}\n`;
	});

	// format headers
	request.headers.forEach((value, key) => {
		headersFormatted += `${key} = ${redactedHeaders.includes(key) ? '*REDACTED*' : value}\n`;
	});

	// construct embeds
	const embeds = [
		{
			title: 'Webhook details',
			color: 5814783,
			fields: [
				{
					name: 'Method',
					value: request.method,
					inline: true,
				},
				{
					name: 'Host',
					value: url.hostname,
					inline: true,
				},
				{
					name: 'Path',
					value: url.pathname,
					inline: true,
				},
				searchParamsFormatted
					? {
							name: 'Search params',
							value: searchParamsFormatted,
					  }
					: undefined,
				headersFormatted
					? {
							name: 'Headers',
							value: headersFormatted,
					  }
					: undefined,
			].filter(Boolean),
			timestamp: new Date().toISOString(),
		},
	];

	// construct discord message FormData
	const formData = new FormData();

	const message = {
		username: 'repeat.dev',
		content: null,
		embeds,
	};

	formData.append('payload_json', JSON.stringify(message));

	let blob;
	let blobFileExtension;
	if (request.headers.get('content-type')?.includes('application/json')) {
		blob = new Blob([JSON.stringify(await request.json(), null, 2)], {
			type: 'application/json',
		});
		blobFileExtension = 'json';
	} else if (request.headers.get('content-type')?.includes('form')) {
		blob = new Blob([JSON.stringify(Object.fromEntries(await request.formData()), null, 2)], {
			type: 'application/json',
		});
		blobFileExtension = 'json';
	} else if (request.headers.get('content-type')?.includes('text/')) {
		blob = new Blob([await request.text()], {
			type: 'text/plain',
		});
		blobFileExtension = 'txt';
	}

	if (blob) {
		formData.append('file', blob, `body.${blobFileExtension}`);
	}

	// send webhook
	await fetch(env.variables.WEBHOOK_SECRET, {
		method: 'POST',
		body: formData,
	});
}
