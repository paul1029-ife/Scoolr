import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";

import { AuthShell } from "@/components/auth/auth-shell";

/**
 * Neon Auth's secondary views (forgot-password, reset-password, callback,
 * sign-out, …). The primary entry points are the app's own forms at /login and
 * /signup; these keep Neon's UI but sit inside the same branded shell.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <AuthShell withCard={false}>
      <AuthView path={path} />
    </AuthShell>
  );
}
