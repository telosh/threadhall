import type { NextConfig } from "next";
import { withEmulate } from "@emulators/adapter-next";

const nextConfig: NextConfig = {
  // Cloud Run / Docker 本番用（Dockerfile で .next/standalone をコピー）
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // mock 用ホットリンク画像（docs/stich/aistudio 由来）。
    // 本番化時に CMS / オブジェクトストレージに置き換える。
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
    ],
  },
};

export default withEmulate(nextConfig);
