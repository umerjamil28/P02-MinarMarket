/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
          },
          {
            protocol: 'https',
            hostname: 'placeholder.com',
          },
          {
            protocol: 'https',
            hostname: 'dummyimage.com',
          },
          {
            protocol: 'https',
            hostname:"res.cloudinary.com"
          }
        ],
    }
};

export default nextConfig;
