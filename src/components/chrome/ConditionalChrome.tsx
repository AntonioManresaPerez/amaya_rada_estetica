"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { PageBackdrop } from "@/components/decor/PageBackdrop";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");
  const isHome = pathname === "/";

  if (isStudio) return <>{children}</>;

  // reducedMotion="user": respeta la preferencia del sistema operativo →
  // mantiene los fundidos (opacity) y desactiva desplazamientos/escala (transform).
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      {/* Fondo ambiental en páginas internas (la home ya tiene sus propios fondos) */}
      {!isHome && <PageBackdrop />}
      {children}
      <Footer />
      <WhatsAppButton />
    </MotionConfig>
  );
}
