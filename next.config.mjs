/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "orthofoodie-test.s3.eu-west-2.amazonaws.com" },
      { hostname: "orthofoodie.s3.eu-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
