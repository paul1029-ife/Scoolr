import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// Neon's auth UI ships its own utility bundle that includes a second `.hidden`
// rule. It must be imported BEFORE globals.css, or it wins the cascade and
// breaks every `hidden md:flex` / `hidden lg:flex` in the app — including the
// marketing navbar's desktop menu.
import "@neondatabase/auth-ui/css";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scoolr.vercel.app/"),
  title: "Scoolr",
  description:
    "The complete platform that empowers secondary schools to effortlessly manage staff, students, finances, and events.",
  keywords: [
    "school management",
    "education platform",
    "student management",
    "teacher tools",
    "finance tracking",
  ],
  authors: {
    name: "Paul Ifeoluwa Agbogun",
    url: "https://ifeoluwa.tech",
  },
  openGraph: {
    title: "Scoolr",
    description:
      "The complete platform that empowers secondary schools to effortlessly manage staff, students, finances, and events.",
    url: "https://scoolr.vercel.app",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scoolr Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scoolr",
    description:
      "The complete platform that empowers secondary schools to effortlessly manage staff, students, finances, and events.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes (inside the auth UI provider) writes to <html> before React
    // hydrates, so this attribute is required to avoid a mismatch warning.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-primary antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
