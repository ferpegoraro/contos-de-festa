import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async rewrites() {
    // Proxy opcional para produção: com API_PROXY_TARGET setado (URL do
    // backend no Render/Railway), o browser chama /api/* no próprio domínio
    // do site e o Next repassa — o cookie httpOnly vira first-party e
    // funciona sem domínio customizado. Use junto com
    // NEXT_PUBLIC_API_URL="/api".
    const target = process.env.API_PROXY_TARGET;
    if (!target) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${target.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
