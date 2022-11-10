export default {
	async webhook(request: Request, env: Repeat.Env) {
		const url = new URL(request.url);

		const title = url.searchParams.get('title') || 'Hello World: Region Earth';
		const backgroundImage = 'https://dash.repeat.dev/og/background.png';
		const logoImage = 'https://dash.repeat.dev/og/logo.png';

		// the API is the same as https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation
		const ogElement = (
			<div
				style={{
					backgroundImage: `url(${backgroundImage})`,
					backgroundSize: '100% 100%',
					height: '100%',
					width: '100%',
					display: 'flex',
					textAlign: 'left',
					//alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					flexWrap: 'nowrap',
				}}
			>
				<div
					style={{
						fontSize: 60,
						fontStyle: 'normal',
						letterSpacing: '-0.025em',
						color: 'white',
						marginTop: 30,
						padding: '0 160px 0 60px',
						//lineHeight: 1,
						whiteSpace: 'pre-wrap',
					}}
				>
					{title}
				</div>
				<div
					style={{
						display: 'flex',
						position: 'absolute',
						bottom: 15,
						right: 20,
					}}
				>
					<img height={50} src={logoImage} />
				</div>
			</div>
		);

		return env.og.image(ogElement, {
			width: 1200,
			height: 600,
		});
	},
};
