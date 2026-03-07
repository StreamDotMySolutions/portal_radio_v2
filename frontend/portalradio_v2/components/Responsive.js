'use client';

import useIsMobile from '@/hooks/useIsMobile';

export default function Responsive({ mobile: Mobile, desktop: Desktop, ...props }) {
  const isMobile = useIsMobile();
  return isMobile ? <Mobile {...props} /> : <Desktop {...props} />;
}
