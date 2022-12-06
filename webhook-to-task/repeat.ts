export default {
	async webhook(request: Request, env: Repeat.Env) {
		const json: any = await request.json();

		// add task with request JSON body to be processed in the background
		// add and process new task right away
		await env.unstable.tasks.add(json);

		// schedule two tasks to be processed in 60 seconds
		await env.unstable.tasks.schedule({ foo: 'bar1' }, Date.now() + 60 * 1000);
		// optionally, set our IDs in options
		const taskToRunId = crypto.randomUUID();
		await env.unstable.tasks.schedule({ foo: 'bar2' }, Date.now() + 60 * 1000, { id: taskToRunId });
		const taskToUpdateId = crypto.randomUUID();
		await env.unstable.tasks.schedule({ foo: 'bar3' }, Date.now() + 60 * 1000, { id: taskToUpdateId });

		// if we have task ID, we can trigger any scheduled task to run in the background right away
		await env.unstable.tasks.run(taskToRunId);

		// if we have task ID, we can update any options (just data in this example, runAt remains the same)
		await env.unstable.tasks.update(taskToUpdateId, { data: { foo: 'bar42' } });

		// get and list all scheduled tasks
		// this my include tasks that were ran recently (still running) - as they are deleted only after a successful run
		console.log(await env.unstable.tasks.list());

		// and last, try to update not existent task - this will trigger and save an exception in our webhook trace
		console.log(
			'updated:',
			await env.unstable.tasks.update(crypto.randomUUID(), { data: { foo: 'bar42' }, runAt: Date.now() + 5000 })
		);

		return Response.json({ success: true });
	},

	// task() is handler for any tasks created for this repeat
	// to demonstrate retries, we will randomly throw an exception
	async task(task: Repeat.Task) {
		// throw exception for 20% of requests
		if (Math.random() < 0.2) {
			throw new Error('failed for some reason, will be retried');
		}

		console.log('processed task:', task);
	},

	async cron() {},
};
