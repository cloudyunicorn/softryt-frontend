/**
 * SoftRYT — Site Footer
 * ========================
 * Minimal footer with branding and useful links.
 */

import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="Cloudy Unicorn" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Cloudy <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Unicorn</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered SaaS comparison platform. Find the right tool for your team with data-driven analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#comparisons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Comparisons
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Categories</h4>
            <ul className="space-y-2">
              {["Project Management", "Developer Tools", "AI Tools", "Design", "Analytics"].map(
                (cat) => (
                  <li key={cat}>
                    <span className="text-sm text-muted-foreground">
                      {cat}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Cloudy Unicorn. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Some links are affiliate links. We may earn a commission at no cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
