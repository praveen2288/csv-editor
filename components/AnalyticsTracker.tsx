"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

const AnalyticsTracker: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null; // This component does not render anything
};

export default AnalyticsTracker;
