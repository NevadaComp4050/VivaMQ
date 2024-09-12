/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Add some logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
};

export default nextConfig;
