import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "16mb",
  },
  serverActions: {
    bodySizeLimit: "16mb",
  },
};

export default nextConfig;
