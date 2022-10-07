import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { basicAuth } from 'hono/basic-auth';

export default {
	async webhook(request: Request, env: Repeat.Env) {
		const app = new Hono();

		// CORS
		app.use('*', cors());

		// Bultin logger
		app.use('*', logger());

		// Custom middleware
		app.use('*', async (c, next) => {
			await next();
			c.header('X-message', 'Hono is a cool project');
		});

		// Basic Auth
		app.use(
			'/auth/*',
			basicAuth({
				username: env.variables.BASIC_AUTH_USER,
				password: env.variables.BASIC_AUTH_PASS,
			})
		);

		// Routing
		app.get('/', c => c.html('<h1>Hello Hono!</h1>'));
		app.get('/auth/*', c => c.text('You are authorized'));

		return app.fetch(request);
	},
};
