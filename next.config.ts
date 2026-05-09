import type { NextConfig } from "next";
import { withEmulate } from "@emulators/adapter-next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default withEmulate(nextConfig);
