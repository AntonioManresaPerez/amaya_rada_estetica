"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/servicios", label: "Servicios" },
  { href: "/galeria", label: "Galería" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/90 shadow-sm backdrop-blur-md border-b border-thistle/30"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-indigo-velvet hover:text-vintage-lavender transition-colors"
        >
          {siteConfig.shortName}
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "text-vintage-lavender"
                    : "text-foreground/70 hover:text-indigo-velvet"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/reservar"
          className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
        >
          Reservar cita
        </Link>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Abrir menú"
            className="md:hidden p-2 text-foreground rounded-md hover:bg-muted transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-8">
            <nav className="flex flex-col gap-5 pt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "text-vintage-lavender"
                      : "text-foreground hover:text-indigo-velvet"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full justify-center")}
              >
                Reservar cita
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
