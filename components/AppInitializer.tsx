"use client";

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

const AppInitializer: React.FC = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null; // This component does not render anything
};

export default AppInitializer;
