import { json } from 'itty-router-extras';

interface AnalyticsEngineEvent {
	doubles?: number[];
	blobs?: string[];
}

interface Env {
	AE_ANALYTICS: {
		writeDataPoint(event?: AnalyticsEngineEvent): void;
	};
}
type Template = {
	repeat: {
		name: string;
		description: string;
	};
	events: {
		type: string;
		cron?: string;
	}[];
	variables: {
		key: string;
		value: string;
		is_secret: boolean;
	};
};

// @ts-ignore
const templates: Record<string, Template> = _REPEAT_TEMPLATES;
const defaultTemplate = 'webhook';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response('ok');
		}

		const url = new URL(request.url);
		const template = url.pathname.substring(1) || '';
		const requestType =
			request.headers.get('accept')?.includes('application/json') ||
			request.headers.get('content-type') === 'application/json' ||
			url.searchParams.has('json')
				? 'json'
				: 'redirect';

		env.AE_ANALYTICS.writeDataPoint({
			blobs: [template, requestType],
			doubles: [1],
		});

		if (requestType === 'json') {
			const res = url.pathname === '/' ? templates : templates[url.pathname.substring(1)];
			if (res) {
				return json(res);
			} else {
				return json({ error: 'template not found' }, { status: 404 });
			}
		} else {
			// TODO revert once templates UI part is done
			if (template) {
				return Response.redirect(`https://dash.repeat.dev/?from_template=${template || defaultTemplate}`, 302);
			} else {
				return new Response('not found, coming soon', { status: 404 });
			}
		}
	},
};
