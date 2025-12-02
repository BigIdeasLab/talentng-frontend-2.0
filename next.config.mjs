/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
        pathname: "/talent.ng/**",
      },
      {
        protocol: "https",
        hostname: "api.builder.io",
        pathname: "/api/v1/image/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_TALENTNG_API_URL;
    if (!apiUrl) {
      return [];
    }
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
