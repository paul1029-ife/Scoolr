import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

/** Scoolr wordmark, matching the treatment used in the navbar and hero. */
export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="text-2xl font-bold tracking-tight">
      <span className="text-blue-600">S</span>
      <span className={onDark ? "text-white" : "text-gray-900"}>cool</span>
      <span className="text-indigo-400">r</span>
    </span>
  );
}

const HIGHLIGHTS = [
  "Manage staff, students and classes in one place",
  "Track attendance and fees without spreadsheets",
  "Built for Nigerian secondary schools",
];

/**
 * Split layout shared by sign in and sign up: brand panel on large screens,
 * form card on the right. Reuses the landing page's image-with-overlay
 * treatment so the two feel like the same product.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  /** Neon's own AuthView renders its own card, so it opts out of ours. */
  withCard = true,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  withCard?: boolean;
}) {
  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      {/* Brand panel — hidden on small screens where it would just push the form down */}
      <div className="relative hidden lg:flex flex-col justify-between p-12">
        <div className="absolute inset-0">
          <Image
            src="/school.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-800/75" />
        </div>

        <Link href="/" className="relative z-10 w-fit">
          <Wordmark onDark />
        </Link>

        <div className="relative z-10 max-w-md">
          <div className="inline-block px-3 py-1 bg-blue-500/60 rounded-full text-blue-50 text-sm font-medium mb-4">
            All-in-one School Management Platform
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-6">
            Everything your school runs on, in one place.
          </h2>
          <ul className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-gray-400">
          © {new Date().getFullYear()} Scoolr
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen items-center justify-center p-6 lg:min-h-0">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 block w-fit lg:hidden">
            <Wordmark />
          </Link>

          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}

          {withCard ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {children}
            </div>
          ) : (
            children
          )}

          {footer && (
            <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}
