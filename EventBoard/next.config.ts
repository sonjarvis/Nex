import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/register', // 원하는 페이지 경로
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
