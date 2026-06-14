"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

type TrackData = Record<string, string | number | boolean | null>;

interface TrackedLinkProps {
  href: string;
  event: string;
  data?: TrackData;
  external?: boolean;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

// Enlace que registra un evento de clic en Vercel Analytics (visible en el
// panel de Vercel). En local/dev es un no-op; solo cuenta en producción.
export function TrackedLink({
  href,
  event,
  data,
  external,
  className,
  children,
  ...rest
}: TrackedLinkProps) {
  const onClick = () => track(event, data);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
