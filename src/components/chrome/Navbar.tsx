"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/servicios", label: "Servicios" },
  { href: "/#sobre-mi", label: "Sobre mí" },
  { href: "/galeria", label: "Galería" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [curtainActive, setCurtainActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const tint = () => setCurtainActive(true);
    const untint = () => setCurtainActive(false);
    window.addEventListener("curtain:open", tint);
    window.addEventListener("curtain:settle-in", tint);
    window.addEventListener("curtain:settle-out", untint);
    return () => {
      window.removeEventListener("curtain:open", tint);
      window.removeEventListener("curtain:settle-in", tint);
      window.removeEventListener("curtain:settle-out", untint);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          curtainActive
            ? "bg-lavender-veil/80 backdrop-blur-md border-b border-thistle/40"
            : scrolled
            ? "bg-background/90 shadow-sm backdrop-blur-md border-b border-thistle/30"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-serif text-lg md:text-2xl font-semibold text-indigo-velvet hover:text-vintage-lavender transition-colors"
          >
            {siteConfig.name}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-base font-medium transition-colors",
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

          {/* Mobile hamburger */}
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="md:hidden p-2 text-foreground rounded-md hover:bg-muted transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay — rendered outside header to avoid stacking context issues */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-deep-space/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Floating panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 z-50 w-[85vw] max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-linear-to-br from-indigo-velvet to-deep-space shadow-2xl overflow-hidden"
            >
              {/* Decorative top strip */}
              <div className="h-1 w-full bg-linear-to-r from-vintage-lavender via-lavender-veil to-vintage-lavender" />

              <div className="px-7 py-7">
                {/* Close */}
                <button
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-thistle/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <XIcon className="h-5 w-5" />
                </button>

                {/* Brand */}
                <p className="mb-5 text-center font-serif text-xs tracking-[0.25em] uppercase text-thistle/50">
                  {siteConfig.name}
                </p>

                <div className="mb-5 h-px bg-thistle/20" />

                {/* Nav links */}
                <nav className="mb-7 flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.07 + i * 0.055, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-xl px-4 py-3 font-serif text-2xl transition-all",
                          pathname.startsWith(link.href)
                            ? "bg-white/15 font-semibold text-lavender-veil"
                            : "text-thistle hover:bg-white/10 hover:text-lavender-veil"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* CTA */}
                <Link
                  href="/reservar"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl bg-lavender-veil px-6 py-3 text-center text-sm font-medium text-indigo-velvet transition-colors hover:bg-white"
                >
                  Reservar cita
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
