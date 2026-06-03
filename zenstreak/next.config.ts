import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_USER_API_PATH: process.env.NEXT_PUBLIC_USER_API_PATH,
  },

};

export default nextConfig;
