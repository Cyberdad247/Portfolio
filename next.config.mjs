/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: *.supabase.co;
              font-src 'self';
              connect-src 'self' *.supabase.co *.livekit.cloud http://localhost:8080 http://localhost:20128 https://api.mistral.ai;
              frame-src 'self';
            `
							.replace(/\s+/g, " ")
							.trim(),
					},
				],
			},
		];
	},
};

export default nextConfig;
