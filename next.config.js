/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://127.0.0.1:8000',
  },
}

module.exports = nextConfig
