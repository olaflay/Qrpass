/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix turbopack root directory detection
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@supabase/ssr",
      "@supabase/supabase-js",
    ],
  },
  // Vercel deployment optimizations
  serverExternalPackages: ["qrcode"],
}

module.exports = nextConfig