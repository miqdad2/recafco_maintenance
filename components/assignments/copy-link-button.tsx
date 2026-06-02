"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
    >
      <Copy className="h-4 w-4" />
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
