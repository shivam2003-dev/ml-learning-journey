import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }] },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"], inlineCss: true },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
