// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://oussamajabnouni.github.io',
	base: '/my-starlight-docs',
	integrations: [
		starlight({
			title: 'SANAD Founder Playbook',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/oussamajabnouni/my-starlight-docs' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/sanad-ai' },
			],
			sidebar: [
				{
					label: 'Foundation',
					items: [
						{ label: 'Overview & Vision', slug: 'index' },
						{ label: 'Market Analysis', slug: 'foundation/market-analysis' },
						{ label: 'Problem & Solution', slug: 'foundation/problem-solution' },
					],
				},
				{
					label: 'Product',
					items: [
						{ label: 'Product Strategy', slug: 'product/strategy' },
						{ label: 'MVP Roadmap', slug: 'product/mvp-roadmap' },
						{ label: 'Technical Architecture', slug: 'product/technical-architecture' },
					],
				},
				{
					label: 'Go-to-Market',
					items: [
						{ label: 'GTM Strategy', slug: 'gtm/strategy' },
					],
				},
				{
					label: 'Operations',
					items: [
						{ label: 'Legal & Compliance', slug: 'operations/legal-compliance' },
						{ label: 'Metrics & KPIs', slug: 'operations/metrics' },
					],
				},
				{
					label: 'Fundraising',
					items: [
						{ label: 'Funding Strategy', slug: 'fundraising/strategy' },
					],
				},
				{
					label: 'Resources',
					items: [
						{ label: 'Weekly Checklist', slug: 'resources/weekly-checklist' },
					],
				},
			],
		}),
	],
});
