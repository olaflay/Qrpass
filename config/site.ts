export const siteConfig = {
  name: "QRPass",
  description:
    "Create branded QR passes, manage attendees, and verify guests at the door — all in one fast, mobile-first workflow.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://qrpass.app",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/qrpass",
    github: "https://github.com/olaflay/Qrpass",
  },
  navItems: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/dashboard/events" },
    { title: "Passes", href: "/dashboard/passes" },
    { title: "Settings", href: "/dashboard/settings" },
  ],
}