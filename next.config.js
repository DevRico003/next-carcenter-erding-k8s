/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
      ignoreBuildErrors: true,
  },
  esLint: {
      ignoreDuringBuilds: true,
  },
  output: 'standalone',
}

module.exports = nextConfig