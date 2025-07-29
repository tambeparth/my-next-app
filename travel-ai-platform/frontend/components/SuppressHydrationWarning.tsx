'use client';

import { useEffect, useState, ReactNode } from 'react';

interface SuppressHydrationWarningProps {
  children: ReactNode;
}

/**
 * A component that suppresses React hydration warnings by only rendering children on the client.
 * Use this component to wrap elements that might cause hydration mismatches.
 */
export default function SuppressHydrationWarning({ children }: SuppressHydrationWarningProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial client render, render a placeholder with the same structure
  // to avoid layout shifts, but without any content that might cause hydration mismatches
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
