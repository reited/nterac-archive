import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'nterac docs',
			logo: {
				src: './src/assets/logo.svg',
			},
			social: {
				github: 'https://github.com/3sdf/nterac-docs/',
			},
			sidebar: [
				{
					label: 'Quick Start',
					items: [
						{ label: 'Get Started', link: '/quick-start/get-started/' },
						{ label: 'Clone Template', link: '/quick-start/clone-template/' },
						{ label: 'Start From Scratch', link: '/quick-start/start-from-scratch/' },
						{ label: 'Feedback and Contribute', link: '/quick-start/feedback-and-contribute/' },
					]
				},
				{
					label: 'Building Blocks',
					items: [
						{ label: 'Get Started', link: '/building-blocks/get-started/' },
						{ label: 'Routes', link: '/building-blocks/routes/' },
						{ label: 'Handlers', link: '/building-blocks/handlers/' },
						{ label: 'Middlewares', link: '/building-blocks/middlewares/' },
						{ label: 'Relays', link: '/building-blocks/relays/' },
						{ label: 'Plugins', link: '/building-blocks/plugins/' },
						{ label: 'Tasks', link: '/building-blocks/tasks/' },
						{ label: 'STD Library', link: '/building-blocks/std-library/' },
					]
				},
				{
					label: 'Deploy',
					items: [
						{ label: 'Get Started', link: '/deploy/get-started/' },
					],
					collapsed: true
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
					collapsed: true
				},
				{
					label: 'STD Library',
					autogenerate: { directory: 'std' },
					collapsed: true
				},
			],
			editLink: {
				baseUrl: 'https://github.com/3sdf/nterac-docs/edit/main/',
			},
			lastUpdated: true,
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
