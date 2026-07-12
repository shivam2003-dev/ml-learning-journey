import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/ml-learning-journey" : "",
  images: { unoptimized: isGitHubPages, remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }] },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"], inlineCss: true },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
