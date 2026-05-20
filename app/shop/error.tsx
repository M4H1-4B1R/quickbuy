"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-2xl uppercase tracking-wide mb-4">
          Something went wrong
        </h2>
        <p className="text-mute mb-6">
           We couldn&apos;t load the shop. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-ink text-canvas text-sm font-medium rounded-sm hover:bg-charcoal transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}