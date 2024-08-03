/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/public/:path*',
        destination: 'http://localhost:4000/public/:path*', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
