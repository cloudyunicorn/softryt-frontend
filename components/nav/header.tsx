/**
 * SoftRYT — Site Header
 * ========================
 * Responsive navigation header with gradient branding and mobile sheet menu.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#comparisons", label: "Comparisons" },
  { href: "/#categories", label: "Categories" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Soft<span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">RYT</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden relative flex items-center">
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-accent/50 text-foreground transition-colors"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </button>

          {/* Floating Pill Menu */}
          {open && (
            <>
              {/* Invisible backdrop to catch outside clicks */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setOpen(false)}
              />
              
              <div className="absolute right-0 top-full mt-3 w-[200px] z-50 animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 origin-top-right">
                <div className="bg-background/80 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-2 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground transition-all rounded-full hover:bg-muted/80 text-center"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
