import type { NextConfig } from "next";

/** Set GITHUB_PAGES=true in CI so assets resolve under /notime2die/ */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "notime2die";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGithubPages
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
