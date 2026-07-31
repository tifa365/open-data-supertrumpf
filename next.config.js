// BASE_PATH is set by the GitHub Pages workflow (e.g. "/open-data-supertrumpf")
// so the static export works under the project subpath; empty locally.
const basePath = process.env.BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
