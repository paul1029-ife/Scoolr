import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
    name: "Paul Agbogun",
    url: "https://ifeoluwa-portfolio-five.vercel.app",
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
    <ClerkProvider afterSignOutUrl={"/"} signInUrl="/login" signUpUrl="/signup">
      <html lang="en">
        <body
          className={`${inter.variable} ${jakarta.variable} font-primary antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
