module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = {
  images: {
    remotePatterns: [new URL('https://unsplash.com/photos/yellow-sunflower-in-close-up-photography-YXWoEn5uOvg')],
  },
}
const nextConfig = {
  images: {
    domains: ["booking.com", "google.com", "example.com"],
  },
};

module.exports = nextConfig;