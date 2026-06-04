"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Failed to load post</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        This post couldn&apos;t be loaded. It may have been removed or there was a network issue.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
