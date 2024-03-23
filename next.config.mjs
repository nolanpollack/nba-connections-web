/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://9fws378c86.execute-api.us-east-2.amazonaws.com/test/:path*',
            },
        ];
    }
};

export default nextConfig;
