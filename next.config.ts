// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/archivos/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zv4guca4hjdrhxia.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
