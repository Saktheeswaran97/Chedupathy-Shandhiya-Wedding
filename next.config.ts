import type { NextConfig } from "next";

const getBasePath = () => {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    const p = process.env.NEXT_PUBLIC_BASE_PATH;
    return p.endsWith("/") ? p.slice(0, -1) : p;
  }
  if (process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
    if (repo && !repo.endsWith(".github.io")) {
      return `/${repo}`;
    }
  }
  return "";
};

const basePath = getBasePath();

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
};

export default config;
