"use client"

import { useEffect } from "react"

export function GlobalPolyfills() {
  useEffect(() => {
    // Polyfill for ResizeObserver if not natively supported (e.g., older browsers or some test environments)
    if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
      import("resize-observer-polyfill").then((module) => {
        window.ResizeObserver = module.default
      })
    }
  }, [])

  return null
}
