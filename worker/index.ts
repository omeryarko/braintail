interface Env {
	ASSETS: Fetcher;
}

const HUMAN_URL = 'https://positiveconstraint.com/braintail';

const AGENT_SIGNALS = [
	'text/markdown',
	'text/plain',
	'application/json',
];

const AGENT_UA_PATTERNS = [
	/claude/i,
	/chatgpt/i,
	/gptbot/i,
	/openai/i,
	/anthropic/i,
	/perplexity/i,
	/cohere/i,
	/bingbot/i,
	/googlebot/i,
	/google-extended/i,
	/meta-externalagent/i,
	/ia_archiver/i,
	/ccbot/i,
	/amazonbot/i,
	/bytespider/i,
	/applebot/i,
	/facebookexternalhit/i,
	/twitterbot/i,
	/linkedinbot/i,
];

function isAgent(request: Request): boolean {
	const ua = request.headers.get('user-agent') || '';
	if (AGENT_UA_PATTERNS.some(p => p.test(ua))) return true;

	const accept = request.headers.get('accept') || '';
	if (accept.includes('text/markdown')) return true;

	if (!accept.includes('text/html') && AGENT_SIGNALS.some(s => accept.includes(s))) return true;

	return false;
}

function resolvePath(pathname: string): string {
	let path = pathname.replace(/\/+$/, '') || '/';

	if (path === '/') return '/llms.txt';
	if (path === '/llms.txt' || path === '/robots.txt' || path === '/sitemap.xml') return path;

	if (!path.endsWith('.md')) path += '.md';

	if (path.startsWith('/')) path = '/site' + path;

	return path;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/robots.txt') {
			return new Response(
				`User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`,
				{ headers: { 'content-type': 'text/plain; charset=utf-8' } }
			);
		}

		if (url.pathname === '/llms.txt') {
			const asset = await env.ASSETS.fetch(new Request(new URL('/llms.txt', url.origin), request));
			if (asset.ok) {
				return new Response(asset.body, {
					status: 200,
					headers: {
						'content-type': 'text/plain; charset=utf-8',
						'cache-control': 'public, max-age=3600',
						'access-control-allow-origin': '*',
					},
				});
			}
		}

		if (isAgent(request)) {
			const filePath = resolvePath(url.pathname);
			const asset = await env.ASSETS.fetch(new Request(new URL(filePath, url.origin), request));

			if (asset.ok) {
				return new Response(asset.body, {
					status: 200,
					headers: {
						'content-type': 'text/markdown; charset=utf-8',
						'cache-control': 'public, max-age=3600',
						'access-control-allow-origin': '*',
						'x-content-source': 'braintail-agent',
					},
				});
			}

			return new Response('# 404 — Not Found\n\nThis page does not exist. See [/llms.txt](/llms.txt) for the full index.\n', {
				status: 404,
				headers: { 'content-type': 'text/markdown; charset=utf-8' },
			});
		}

		const asset = await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin), request));
		if (asset.ok) {
			return new Response(asset.body, {
				status: 200,
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'cache-control': 'public, max-age=3600',
				},
			});
		}

		return Response.redirect(`${HUMAN_URL}${url.pathname}`, 302);
	},
} satisfies ExportedHandler<Env>;
