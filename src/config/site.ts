export const siteConfig = {
  name: "QRPass",
  description: "QR pass generation and verification for organizers.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  navItems: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/dashboard/events" },
    { title: "Verify", href: "/verify" },
  ],
}
