namespace Repeat {
	export interface Cron {
		/**
		 * Cron event
		 */
		id: string;
		schedule: string;
	}

	export interface Email {
		/**
		 * Email event
		 */
		from: string;
		to: string;
		subject: string;
		body: string;
	}

	/**
	 * Repeat environment - variables, metrics, kv, and others.
	 */
	export interface Env {
		variables: {
			[key: string]: string;
		};
		metrics: {
			write(name: string, value: number, label?: string): void;
			getAll(
				view?: '1h' | '1d' | '7d' | '30d',
				label?: string
			): Promise<Record<MetricName, Record<MetricLabel, { t: string; avg: number; sum: number; count: number }[]>>>;
			get(
				name: string,
				view?: '1h' | '1d' | '7d' | '30d',
				label?: string
			): Promise<Record<MetricLabel, { t: string; avg: number; sum: number; count: number }[]>>;
		};
		kv: Repeat.KV;
		waitUntil(promise: Promise<any>): void;
		webhooks: {
			discord(url: string, message: string | Webhooks.Discord.Payload): Promise<{ ok: boolean; response?: any }>;
			slack(url: string, message: string | Webhooks.Slack.Payload): Promise<{ ok: boolean; response?: any }>;
		};
	}
}
