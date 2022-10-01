type AuditLog = {
	action: {
		info: string;
		result: boolean;
		type: string;
	};
	resource: {
		id: string;
		type: string;
	};
	actor: {
		id: string;
		ip: string;
		email: string;
		type: string;
	};
	when: string;
};

export default {
	async cron(_: Repeat.Cron, env: Repeat.Env): Promise<void> {
		try {
			// get the last processed log timestamp
			let auditLogsSince = await env.kv.get('LAST_PROCESSED_AUDIT_LOG');
			if (!auditLogsSince) {
				// use 5 minutes ago timestamp on first run
				auditLogsSince = new Date(Date.now() - 1000 * 60 * 5).toISOString();
			}

			// fetch and parse audit logs from Cloudflare API
			const response = await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${env.variables.CLOUDFLARE_ACCOUNT_ID}/audit_logs?per_page=25&since=${auditLogsSince}&direction=asc`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${env.variables.CLOUDFLARE_API_TOKEN}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error('failed to fetch Cloudflare API');
			}

			const json: { errors: string[]; result: AuditLog[] } = await response.json();
			let auditLogs = json.result;

			// check if there are any logs to process
			if (auditLogs.length < 1) {
				console.log('No audit logs to process, exiting.');
				return;
			}

			// init counters
			const actionTypes = new Map();
			const actorTypes = new Map();
			const resourceTypes = new Map();

			// process all logs
			auditLogs.map(log => {
				// increment counters
				actionTypes.set(log.action.type, actionTypes.get(log.action.type) + 1 || 1);
				actorTypes.set(log.actor.type, actorTypes.get(log.actor.type) + 1 || 1);
				resourceTypes.set(log.resource.type, resourceTypes.get(log.resource.type) + 1 || 1);

				// log message
				const action = log.action.info || log.action.type;
				const actor = `${log.actor.email} (${log.actor.type})`;
				const resource = log.resource.type;
				console.log(`[${resource}] ${action} by ${actor}`);
			});

			// write audit logs count to metrics
			env.metrics.write('audit_logs', auditLogs.length);
			// write counters to metrics
			actionTypes.forEach((v, k) => {
				env.metrics.write('action_types', v, k);
			});
			actorTypes.forEach((v, k) => {
				env.metrics.write('actor_types', v, k);
			});
			resourceTypes.forEach((v, k) => {
				env.metrics.write('resource_types', v, k);
			});

			// save last processed log timestamp
			await env.kv.put(
				'LAST_PROCESSED_AUDIT_LOG',
				new Date(new Date(auditLogs.pop().when).getTime() + 1000).toISOString()
			);
		} catch (e) {
			console.error('audit logs cron failed!', e.message);
		}
	},
};
