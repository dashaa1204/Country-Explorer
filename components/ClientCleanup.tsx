"use client";

import { useEffect } from "react";

export default function ClientCleanup() {
  useEffect(() => {
    // Remove attributes injected by some browser extensions that cause hydration mismatches
    const removeOverlays = () => {
      try {
        document.querySelectorAll("[fdprocessedid]").forEach((el) => {
          el.removeAttribute("fdprocessedid");
        });

        // Hide small fixed-position floating buttons injected by extensions (e.g., VPN/toolbars)
        document.querySelectorAll("body *").forEach((el) => {
          try {
            const style = window.getComputedStyle(el as Element);
            const rect = (el as Element).getBoundingClientRect();
            const text = (el as Element).textContent?.trim() || "";

            // Conditions to target small fixed overlays or Next logo-like elements
            const isSmallFixed =
              style.position === "fixed" &&
              rect.width <= 56 &&
              rect.height <= 56 &&
              rect.top >= 0 &&
              rect.left >= 0;

            const looksLikeNextLogo =
              isSmallFixed &&
              (text === "N" ||
                text.toLowerCase().includes("next") ||
                (el as Element).getAttribute("title")?.toLowerCase().includes("next") ||
                Boolean((el as Element).querySelector && (el as Element).querySelector("svg") && (el as Element).querySelector("svg")?.innerHTML?.includes('path')));

            const hasNextHref = !!(el as Element).querySelector &&
              (el as Element).querySelector('a[href*="nextjs.org"], a[href*="nextjs.com"]');

            if (isSmallFixed && (looksLikeNextLogo || hasNextHref)) {
              (el as HTMLElement).style.display = "none";
            }
          } catch (e) {
            // ignore per-element errors
          }
        });
      } catch (e) {
        // ignore overall errors
      }
    };

    // Run immediately, then repeatedly for a short period to catch dynamic injections
    removeOverlays();
    const interval = window.setInterval(removeOverlays, 1000);
    const stopTimeout = window.setTimeout(() => window.clearInterval(interval), 6000);

    // Observe mutations to remove elements added after load
    const observer = new MutationObserver(() => removeOverlays());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(stopTimeout);
    };
  }, []);

  return null;
}
