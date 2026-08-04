"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth/client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      redirectTo="/dashboard"
      Link={Link}
      // auth-ui bundles next-themes, which defaults to 'system' and would put
      // `class="dark"` on <html>. globals.css defines a .dark block, so every
      // shadcn component would flip dark while the hand-written bg-white /
      // bg-gray-100 markup stayed light. The app has no dark design, so pin it.
      defaultTheme="light"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
