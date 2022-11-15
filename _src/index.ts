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

type Category = "basics" | "automation" | "web" | "infrastructure"

type Template = {
	id: string;
	featured: boolean;
	category: Category;
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
const templates: Template[] = _REPEAT_TEMPLATES;
const defaultTemplate = 'webhook';

const redirects = new Map([
	['cronjob', 'cron'],
	['hook', 'webhook'],
	['honojs', 'webhook-honojs'],
]);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log(Object.fromEntries(request.headers))

		if (request.method === 'OPTIONS') {
			return new Response('ok');
		}

		const url = new URL(request.url);
		const featured = url.searchParams.has('featured');
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

		if (redirects.has(template)) {
			return Response.redirect(`https://repeat.new/${redirects.get(template)}`, 302);
		}

		if (requestType === 'json') {
			const res =
				url.pathname === '/'
					? featured
						? templates.filter(x => x.featured)
						: templates
					: templates.find(x => x.id === url.pathname.substring(1));
			if (res) {
				return json(res);
			} else {
				return json({ error: 'template not found' }, { status: 404 });
			}
		} else {
			if (template) {
				return Response.redirect(`https://dash.repeat.dev/?from_template=${template || defaultTemplate}`, 302);
			} else {
				return Response.redirect('https://dash.repeat.dev/projects', 302);
			}
		}
	},
};
