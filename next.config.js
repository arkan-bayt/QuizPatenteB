const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // Sign images - cache first (rarely change)
    {
      urlPattern: /^https?:\/\/.*\/img_sign\/.*\.png$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'sign-images',
        expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Book images - cache first
    {
      urlPattern: /^https?:\/\/.*\/img_book\/.*\.(png|jpeg|jpg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'book-images',
        expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Icons - cache first
    {
      urlPattern: /^https?:\/\/.*\/icons\/.*\.png$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'pwa-icons',
        expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // JSON data files - cache first with periodic refresh
    {
      urlPattern: /^https?:\/\/.*\/(quizData|bookLessons|bookLessonsStructured)\.json$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'quiz-data',
        expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Next.js static bundles - stale while revalidate
    {
      urlPattern: /^https?:\/\/.*\/_next\/static\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-static',
        expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // API routes - network first (need fresh data)
    {
      urlPattern: /^https?:\/\/.*\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
        networkTimeoutSeconds: 10,
      },
    },
    // HTML pages - network first
    {
      urlPattern: /^https?:\/\/.*\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-pages',
        expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
        networkTimeoutSeconds: 5,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
