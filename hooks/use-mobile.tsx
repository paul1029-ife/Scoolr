import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

/**
 * Viewport width is an external store, so it is read with
 * `useSyncExternalStore` rather than mirrored into state from an effect. The
 * effect version set state on mount, which cost an extra render on every
 * consumer and left a frame where a mobile viewport still reported desktop.
 *
 * The server snapshot is `false`: there is no viewport to measure while
 * rendering on the server, and desktop is the safer default — same as the
 * `!!isMobile` this used to return while state was still undefined.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}
