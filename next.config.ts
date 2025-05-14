// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/archivos/:path*", // Asegura que se aplica solo a tus archivos
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // Permite que el contenido se muestre en iframes
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
