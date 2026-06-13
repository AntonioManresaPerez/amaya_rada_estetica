"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { MobileBookingBar } from "./MobileBookingBar";
import { PageBackdrop } from "@/components/decor/PageBackdrop";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");
  const isHome = pathname === "/";

  if (isStudio) return <>{children}</>;

  return (
    <>
      <Navbar />
      {/* Fondo ambiental en páginas internas (la home ya tiene sus propios fondos) */}
      {!isHome && <PageBackdrop />}
      {children}
      <Footer />
      <WhatsAppButton />
      <MobileBookingBar />
    </>
  );
}
