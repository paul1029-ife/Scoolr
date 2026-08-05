import { authHandler } from "@/lib/auth/server";

// Proxies browser auth calls to the Neon Auth server.
export const { GET, POST } = authHandler;
