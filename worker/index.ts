const POSCON = 'https://positiveconstraint.com';

const REDIRECT_MAP: Record<string, string> = {
	'/': '/braintail/',
	'/method': '/braintail/the-braintail-method/',
	'/brand-plays': '/braintail/brand-plays/',
	'/llms.txt': '/llms.txt',
	'/presents/csb-group': '/braintail/csb-group/',
	'/presents/z-gaming': '/braintail/z-gaming/',
	'/presents/tal-ron': '/braintail/tal-ron/',
	'/reviews/155-milking-machines': '/braintail/155-milking-machines/',
	'/reviews/bazoom-cognitive-gap': '/braintail/bazoom-cognitive-gap/',
	'/reviews/bettorify-two-story-problem': '/braintail/bettorify-two-story-problem/',
	'/reviews/blask-identity-crisis': '/braintail/blask-identity-crisis/',
	'/reviews/coinspaid-double-edge': '/braintail/coinspaid-double-edge/',
	'/reviews/elantil-blue-moon': '/braintail/elantil-blue-moon/',
	'/reviews/endorphina-empty-stage': '/braintail/endorphina-empty-stage/',
	'/reviews/finera-buried-message': '/braintail/finera-buried-message/',
	'/reviews/finnplay-missing-ingredient': '/braintail/finnplay-missing-ingredient/',
	'/reviews/heroes-of-missed-opportunities': '/braintail/heroes-of-missed-opportunities/',
	'/reviews/inpay-blind-spot': '/braintail/inpay-blind-spot/',
	'/reviews/into-the-void': '/braintail/into-the-void/',
	'/reviews/isx-is-lost-in-translation': '/braintail/isx-is-lost-in-translation/',
	'/reviews/maincard-open-invitation': '/braintail/maincard-open-invitation/',
	'/reviews/myaffiliates-guardian-of-truth': '/braintail/myaffiliates-guardian-of-truth/',
	'/reviews/neosurf-careful-wagers-apm': '/braintail/neosurf-careful-wagers-apm/',
	'/reviews/nla-makeshift-story': '/braintail/nla-makeshift-story/',
	'/reviews/passover-kabbalistic-brand-ritual': '/braintail/passover-kabbalistic-brand-ritual/',
	'/reviews/platipus-50-shades-of-white': '/braintail/platipus-50-shades-of-white/',
	'/reviews/valentina-bagniya-interview': '/braintail/valentina-bagniya-interview/',
	'/reviews/vegangster-beans-of-greatness': '/braintail/vegangster-beans-of-greatness/',
	'/reviews/yaspa-product-outshines-its-story': '/braintail/yaspa-product-outshines-its-story/',
	'/reviews/youre-not-alea': '/braintail/youre-not-alea/',
};

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.replace(/\/+$/, '') || '/';

		if (path === '/robots.txt') {
			return new Response(
				`User-agent: *\nAllow: /\n\n# braintail.ai has moved to positiveconstraint.com/braintail/\n`,
				{ headers: { 'content-type': 'text/plain; charset=utf-8' } },
			);
		}

		const target = REDIRECT_MAP[path];
		if (target) {
			return Response.redirect(`${POSCON}${target}`, 301);
		}

		return Response.redirect(`${POSCON}/braintail/`, 301);
	},
} satisfies ExportedHandler;
