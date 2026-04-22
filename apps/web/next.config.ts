import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@phosphor-icons/react",
    ],
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
