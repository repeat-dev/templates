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
		};
		kv: KVNamespace;
	}
}
