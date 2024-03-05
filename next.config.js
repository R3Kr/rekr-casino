/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {remotePatterns: [{hostname: "cdn.discordapp.com"}]},
    experimental: {
        ppr: true
    }
}

module.exports = nextConfig
