"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/autoescuelas", label: "Todas las autoescuelas", shortLabel: "Autoescuelas" },
  { href: "/provincias", label: "Por provincia" },
  { href: "/test-de-conducir", label: "Test de conducir", badge: "Nuevo" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/autoescuelas?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/75">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative inline-flex items-center whitespace-nowrap rounded-md px-2 lg:px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  "after:absolute after:inset-x-2 lg:after:inset-x-3 after:-bottom-[14px] after:h-0.5 after:rounded-full after:bg-signal after:transition-opacity",
                  isActive
                    ? "text-foreground after:opacity-100"
                    : "text-muted-foreground after:opacity-0 hover:after:opacity-60"
                )}
              >
                {link.shortLabel ? (
                  <>
                    <span className="xl:hidden">{link.shortLabel}</span>
                    <span className="hidden xl:inline">{link.label}</span>
                  </>
                ) : (
                  link.label
                )}
                {link.badge && (
                  <span className="ml-1.5 rounded-full bg-signal px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-signal-foreground">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <Link
            href="/para-autoescuelas"
            className={cn(
              "inline-flex max-[359px]:hidden md:hidden xl:inline-flex items-center whitespace-nowrap rounded-full border px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs xl:text-sm font-semibold transition-colors",
              pathname.startsWith("/para-autoescuelas")
                ? "border-signal bg-signal text-signal-foreground"
                : "border-signal/70 text-foreground hover:bg-signal hover:text-signal-foreground"
            )}
          >
            <span className="sm:hidden">Soy autoescuela</span>
            <span className="hidden sm:inline 2xl:hidden">Para autoescuelas</span>
            <span className="hidden 2xl:inline">¿Tenés una autoescuela?</span>
          </Link>
          {/* Mobile: Icon only, Desktop: Full search */}
          <div className="hidden lg:block">
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Buscar autoescuelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 h-9 rounded-full bg-muted/60 border-transparent px-4 focus-visible:bg-card"
              />
              <Button type="submit" size="sm" className="h-9 w-9 rounded-full p-0" aria-label="Buscar">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile: Search icon only */}
          <div className="block lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              aria-label="Buscar autoescuelas"
              onClick={() => router.push("/autoescuelas")}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
