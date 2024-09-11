const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/chat',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
        {
            protocol: 'https',
            hostname: "**",
            pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: '*.geolava.com',
          pathname: '/**',
        },
    ],
},
}

module.exports = nextConfig
