/** @type {import('next').NextConfig} */
const nextConfig = {
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
