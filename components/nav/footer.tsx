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
    <footer className="border-t border-hairline bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="Cloudy Unicorn" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="text-lg font-bold tracking-tight text-ink">
                Cloudy <span className="bg-gradient-to-r from-brand-blue via-brand-red to-brand-green bg-clip-text text-transparent">Unicorn</span>
              </span>
            </Link>
            <p className="text-sm text-steel max-w-xs leading-relaxed">
              AI-powered SaaS comparison platform. Find the right tool for your team with data-driven analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-ink">Quick Links</div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-steel hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#comparisons" className="text-sm text-steel hover:text-ink transition-colors">
                  All Comparisons
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm text-steel hover:text-ink transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-steel hover:text-ink transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-sm text-steel hover:text-ink transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-ink">Categories</div>
            <ul className="space-y-2">
              {["Project Management", "Developer Tools", "AI Tools", "Design", "Analytics"].map(
                (cat) => (
                  <li key={cat}>
                    <span className="text-sm text-steel">
                      {cat}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-ink">Company</div>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-steel hover:text-ink transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-steel hover:text-ink transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-hairline-soft" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-steel">
            © {currentYear} Cloudy Unicorn. All rights reserved.
          </p>
          <p className="text-xs text-steel/60">
            Some links are affiliate links. We may earn a commission at no cost to you. Built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors underline">Next.js</a>, powered by <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors underline">Supabase</a> and hosted on <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors underline">Netlify</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
