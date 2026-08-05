import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * `next lint` was removed in Next 16, so `npm run lint` calls the ESLint CLI
 * directly. `eslint-config-next` v16 ships flat configs of its own, which
 * replaces the `FlatCompat` shim this file used to need.
 *
 * `next build` no longer lints — run `npm run lint` yourself or in CI.
 */
const eslintConfig = [
  {
    ignores: [".next/**", "lib/generated/prisma/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
