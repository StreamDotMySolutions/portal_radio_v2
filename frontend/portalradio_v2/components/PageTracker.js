'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageview } from '@/utils/analytics';

/**
 * Global page tracker component
 * Tracks pageview for all pages based on the current pathname
 */
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Map pathname to page type and title
    const getPageInfo = (path) => {
      // Home page
      if (path === '/') {
        return { type: 'home', title: 'Homepage' };
      }
      // Station listing page
      if (path === '/senarai-radio') {
        return { type: 'stations_list', title: 'Senarai Radio' };
      }
      // Station detail page
      if (path.startsWith('/station/')) {
        const slug = path.split('/')[2];
        return { type: 'station', title: `Station: ${slug}`, id: slug };
      }
      // Chat page
      if (path === '/chat') {
        return { type: 'chat', title: 'Chat Langsung' };
      }
      // Contact page (Hubungi)
      if (path === '/hubungi') {
        return { type: 'contact', title: 'Hubungi Kami' };
      }
      // About page (Mengenai Kami)
      if (path === '/mengenai-kami') {
        return { type: 'about', title: 'Mengenai Kami' };
      }
      // Default
      return { type: 'page', title: path };
    };

    const pageInfo = getPageInfo(pathname);

    // Track the pageview (skip station detail as it has its own tracking)
    if (pageInfo.type !== 'station') {
      trackPageview(
        pageInfo.type,
        pageInfo.id || null,
        pageInfo.title
      );
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
