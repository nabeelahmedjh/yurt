/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const nextConfig = {
    async rewrites() {
        return [
            {
				source: '/api/:path*',
				destination: `${API_URL}/:path*`,
			},
        ]
    }

}

export default nextConfig;
