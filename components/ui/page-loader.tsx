/**
 * SoftRYT — Page Loading & Transition Utilities
 * ==============================================
 * Renders a full-screen initial splash loader for website entry
 * and a custom brand-aligned crawling progress bar for page transitions.
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * InitialLoader: Renders a premium full-screen splash screen when the website
 * first loads, fading out smoothly once the client bundle is hydrated.
 */
export function InitialLoader() {
  const [mounted, setMounted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Once hydration completes, trigger fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 450);

    // Completely unmount after transition completes
    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 1150); // 450ms delay + 700ms transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0f] transition-all duration-700 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none scale-98" : "opacity-100"
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-hero-glow opacity-50" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Pulsing ring and bouncing brand icon */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue via-brand-red to-brand-green opacity-40 blur-xl animate-pulse" />
          <img
            src="/logo.png"
            alt="Cloudy Unicorn"
            className="w-18 h-18 object-contain drop-shadow-[0_0_15px_rgba(100,104,203,0.5)] animate-bounce duration-[2500ms]"
          />
        </div>

        {/* Brand branding text */}
        <div className="text-2xl font-bold tracking-tight text-white flex flex-col items-center gap-2">
          <span>
            Cloudy{" "}
            <span className="bg-gradient-to-r from-brand-blue via-brand-red to-brand-green bg-clip-text text-transparent animate-text-gradient">
              Unicorn
            </span>
          </span>
        </div>

        {/* Custom premium color-wheel spinner */}
        <div className="relative w-10 h-10 mt-4">
          <div className="absolute inset-0 rounded-full border-2 border-white/5" />
          <div className="absolute inset-0 rounded-full border-2 border-t-brand-blue border-r-brand-red border-b-brand-green border-l-brand-yellow animate-spin duration-1000" />
        </div>
      </div>
    </div>
  );
}

/**
 * ProgressBar: Instantly responds to user click-based navigation,
 * crawling at the top of the viewport to indicate active page transition.
 */
export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset and hide when pathname or search parameters change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Handle progress crawl progression
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible && progress < 90) {
      timer = setInterval(() => {
        setProgress((prev) => {
          // Asymptotically approach 90%
          const diff = (90 - prev) * 0.15;
          return Math.min(90, prev + Math.max(1, diff));
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [visible, progress]);

  useEffect(() => {
    const startProgress = () => {
      setVisible(true);
      setProgress(10);
    };

    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (!target) return;
      const anchor = target as HTMLAnchorElement;

      // Skip non-navigating links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel") === "external"
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Skip cross-origin or same-page anchor links
        if (url.origin !== currentUrl.origin) return;
        if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
          return;
        }

        startProgress();
      } catch {
        // Safe fallback for URL parsing
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    // Intercept pushState & replaceState to capture programmatic navigation complete
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(() => {
        setProgress(100);
      }, 0);
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      setTimeout(() => {
        setProgress(100);
      }, 0);
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-1 w-full pointer-events-none transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(to right, var(--color-brand-blue), var(--color-brand-red), var(--color-brand-green), var(--color-brand-yellow))",
        boxShadow: "0 0 10px rgba(127, 203, 100, 0.5), 0 0 5px rgba(100, 104, 203, 0.5)",
      }}
    />
  );
}
