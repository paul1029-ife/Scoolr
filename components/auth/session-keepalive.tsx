"use client";

import { useEffect, useRef } from "react";

import { authClient } from "@/lib/auth/client";

/**
 * Refresh slightly ahead of the 300s session-data cookie cache, so an active
 * user's session is revalidated before the middleware ever sees a stale one.
 */
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

/**
 * How long without any interaction before we stop refreshing. Someone who has
 * walked away should still be signed out — keeping an abandoned tab alive
 * indefinitely is the thing this must not do.
 */
const IDLE_AFTER_MS = 30 * 60 * 1000;

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll"] as const;

/**
 * Keeps the session alive while the dashboard is actually being used.
 *
 * Renders nothing. Without it a session can lapse mid-task and the next action
 * bounces the user to sign in again, losing whatever they were part-way
 * through.
 */
export function SessionKeepAlive() {
  // Seeded in the effect rather than here: reading the clock during render is
  // impure. Mounting still counts as activity, because the effect runs before
  // the first tick of the interval it sets up.
  const lastActivityAt = useRef(0);

  useEffect(() => {
    const markActive = () => {
      lastActivityAt.current = Date.now();
    };

    markActive();

    const refresh = async () => {
      // A hidden tab is not "in use"; nor is one nobody has touched in a while.
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastActivityAt.current > IDLE_AFTER_MS) return;

      try {
        // Bypasses the signed cookie cache so the auth server actually extends
        // the session rather than replaying what it last told us.
        await authClient.getSession({ query: { disableCookieCache: true } });
      } catch {
        // Offline or a blip — the next tick tries again, and a genuinely dead
        // session is handled by runAction when an action is attempted.
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        markActive();
        // Coming back to the tab is the moment someone is about to act, so
        // revalidate immediately rather than waiting for the next tick.
        void refresh();
      }
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, markActive, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, markActive);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return null;
}

export default SessionKeepAlive;
