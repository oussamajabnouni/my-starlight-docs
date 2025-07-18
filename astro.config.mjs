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
			logo: {
				light: './src/assets/sanad-logo-light.svg',
				dark: './src/assets/sanad-logo-dark.svg',
				replacesTitle: false,
			},
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
						{ label: 'AI Features', slug: 'product/ai-features' },
					],
				},
				{
					label: 'Go-to-Market',
					items: [
						{ label: 'GTM Strategy', slug: 'gtm/strategy' },
						{ label: 'Tunisia Launch', slug: 'gtm/tunisia-launch' },
						{ label: 'Saudi Expansion', slug: 'gtm/saudi-expansion' },
						{ label: 'Pricing Strategy', slug: 'gtm/pricing' },
					],
				},
				{
					label: 'Operations',
					items: [
						{ label: 'Team Building', slug: 'operations/team-building' },
						{ label: 'Legal & Compliance', slug: 'operations/legal-compliance' },
						{ label: 'Metrics & KPIs', slug: 'operations/metrics' },
					],
				},
				{
					label: 'Fundraising',
					items: [
						{ label: 'Funding Strategy', slug: 'fundraising/strategy' },
						{ label: 'Pitch Deck', slug: 'fundraising/pitch-deck' },
						{ label: 'Financial Model', slug: 'fundraising/financial-model' },
					],
				},
				{
					label: 'Resources',
					items: [
						{ label: 'Templates', slug: 'resources/templates' },
						{ label: 'Partnerships', slug: 'resources/partnerships' },
						{ label: 'Weekly Checklist', slug: 'resources/weekly-checklist' },
					],
				},
			],
		}),
	],
});
