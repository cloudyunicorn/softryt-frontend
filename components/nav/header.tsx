/**
 * SoftRYT — Site Header
 * ========================
 * Responsive navigation header with brand-aligned gradient branding,
 * unified desktop tabs, and a modern mobile dropdown pill.
 */

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#comparisons", label: "Comparisons" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/#categories", label: "Categories" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeHash, setActiveHash] = useState("/");

  const [activeTabRect, setActiveTabRect] = useState<{ left: number; width: number } | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);

  // Scroll spy IntersectionObserver for homepage sections
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = ["hero", "comparisons", "categories"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (id === "hero") {
                setActiveHash("/");
              } else {
                setActiveHash(`/#${id}`);
              }
            }
          });
        },
        {
          rootMargin: "-25% 0px -55% 0px", // Trigger when section is in view focus
          threshold: 0,
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, [pathname]);

  // Determine if a link should be styled as active
  const isLinkActive = (href: string) => {
    if (pathname !== "/") {
      const linkPathname = href.split("#")[0];
      if (linkPathname === "/") return false;
      return pathname.startsWith(linkPathname);
    } else {
      if (href === "/") {
        return activeHash === "" || activeHash === "/";
      }
      return activeHash === href;
    }
  };

  // Recalculate the active tab's bounding rect for the sliding transition
  useEffect(() => {
    function updateRect() {
      if (activeTabRef.current && tabsContainerRef.current) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const activeRect = activeTabRef.current.getBoundingClientRect();
        
        setActiveTabRect({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
        });
      } else {
        setActiveTabRect(null);
      }
    }

    updateRect();
    const timeoutId = setTimeout(updateRect, 100);

    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("resize", updateRect);
      clearTimeout(timeoutId);
    };
  }, [activeHash, pathname]);

  // Close the mobile dropdown when clicking anywhere outside of it
  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 bg-transparent pointer-events-none"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-6 bg-[#0a0a0f]/70 backdrop-blur-xl border border-white/8 rounded-full shadow-lg shadow-black/20 pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Cloudy Unicorn" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="text-xl font-bold tracking-tight text-ink">
            Cloudy <span className="bg-gradient-to-r from-brand-blue via-brand-red to-brand-green bg-clip-text text-transparent">Unicorn</span>
          </span>
        </Link>

        {/* Desktop Navigation (Unified Modern Tabs) */}
        <nav 
          ref={tabsContainerRef}
          className="hidden md:flex relative items-center gap-1 bg-surface/30 border border-hairline/80 rounded-full p-1.5 shadow-inner shadow-black/5"
        >
          {/* Sliding active tab indicator */}
          {activeTabRect && (
            <div 
              className="absolute top-1.5 bottom-1.5 bg-card border border-hairline shadow-sm rounded-full transition-all duration-300 ease-out"
              style={{
                left: `${activeTabRect.left}px`,
                width: `${activeTabRect.width}px`,
              }}
            />
          )}

          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={isActive ? (el => { activeTabRef.current = el; }) : null}
                className={`relative z-10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 rounded-full ${
                  isActive
                    ? "text-ink"
                    : "text-slate hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
 
        {/* Mobile Navigation (Pill-style Explore Dropdown) */}
        <div ref={menuRef} className="md:hidden relative flex items-center">
          <button
            onClick={() => setOpen(!open)}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer ${
              open
                ? "bg-surface text-ink border-hairline-dark shadow-sm"
                : "bg-surface/50 text-slate border-hairline hover:text-ink hover:bg-surface hover:border-hairline/80"
            }`}
            aria-expanded={open}
          >
            <div className="w-4.5 h-3 flex flex-col justify-between relative">
              <span
                className={`h-0.5 w-full bg-brand-blue rounded-full transition-all duration-300 ${
                  open ? "rotate-45 absolute top-[5px] left-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-brand-red rounded-full transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full bg-brand-green rounded-full transition-all duration-300 ${
                  open ? "-rotate-45 absolute top-[5px] left-0" : ""
                }`}
              />
            </div>
            <span className="sr-only">Toggle menu</span>
          </button>
 
          {/* Floating Mobile Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-3 w-[220px] z-50 animate-in fade-in slide-in-from-top-3 zoom-in-95 duration-200 origin-top-right">
              <div className="bg-card/95 backdrop-blur-2xl border border-hairline shadow-lg rounded-2xl p-2.5 flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all rounded-xl text-center border ${
                        isActive
                          ? "bg-surface text-ink border-hairline font-bold"
                          : "text-slate hover:text-ink hover:bg-surface/50 border-transparent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
