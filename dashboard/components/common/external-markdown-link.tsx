"use client";

import { MouseEvent, ReactNode, useState } from "react";

interface ExternalMarkdownLinkProps {
  href?: string;
  children: ReactNode;
}

function isExternalHttpUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function ExternalMarkdownLink({ href, children }: ExternalMarkdownLinkProps) {
  const [error, setError] = useState<string | null>(null);

  async function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href || !isExternalHttpUrl(href)) {
      return;
    }

    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/system/open-external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: href }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to open external URL.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open link in Chrome.");
    }
  }

  return (
    <>
      <a href={href} onClick={onClick} rel="noreferrer" className="underline underline-offset-2">
        {children}
      </a>
      {error ? <span className="ml-2 text-xs text-amber-300">{error}</span> : null}
    </>
  );
}
