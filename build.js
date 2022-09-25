#!/usr/bin/env node

const esbuild = require('esbuild');
const { readdirSync, existsSync, readFileSync } = require('fs');
const yaml = require('js-yaml');

const getDirectories = source =>
	readdirSync(source, { withFileTypes: true })
		.filter(
			dirent =>
				dirent.isDirectory() && existsSync(`./${dirent.name}/repeat.ts`) && existsSync(`./${dirent.name}/repeat.yml`)
		)
		.map(dirent => dirent.name);

const repeatTemplates = {};
getDirectories('./').map(t => {
	const config = yaml.load(readFileSync(`./${t}/repeat.yml`, { encoding: 'utf-8' }));
	repeatTemplates[t] = {
		...config,
		repeat: {
			...config.repeat,
			script: readFileSync(`./${t}/repeat.ts`, { encoding: 'utf-8' }),
		},
	};
});

esbuild.build({
	entryPoints: ['./_src/index.ts'],
	minify: true,
	bundle: true,
	format: 'esm',
	outfile: './dist/worker.js',
	define: {
		_REPEAT_TEMPLATES: JSON.stringify(repeatTemplates),
	},
});
