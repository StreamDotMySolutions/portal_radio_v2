'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Hardcoded defaults for fallback
const defaultFooter = {
  description: 'Radio Televisyen Malaysia (RTM) adalah penyiar nasional yang menghadirkan konten berkualitas, mendidik, dan menghibur masyarakat Malaysia sejak 1963.',
  phone: '+603 2282 3456',
  email: 'info@rtm.gov.my',
  address: 'Jalan Semarak, 50564 KL',
  copyright: '© 2025 RTM — Radio Televisyen Malaysia. Hak Cipta Terpelihara.',
  section_about: 'Tentang Portal Radio RTM',
  section_quick: 'Pautan Pantas',
  section_network: 'Rangkaian RTM',
  section_contact: 'Hubungi Kami',
  quick_links: [
    { title: 'Utama', url: '/', is_external: false },
    { title: 'Senarai Radio', url: '/senarai-radio', is_external: false },
    { title: 'Chat', url: '/chat', is_external: false },
  ],
  network_links: [
    { title: 'Portal Rasmi RTM', url: 'https://www.rtm.gov.my', is_external: true },
    { title: 'Berita RTM', url: 'https://berita.rtm.gov.my', is_external: true },
    { title: 'RTM Klik', url: 'https://rtmklik.rtm.gov.my', is_external: true },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  const [footer, setFooter] = useState(defaultFooter);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';
        const response = await fetch(`${apiUrl}/home-footer`);
        if (response.ok) {
          const data = await response.json();
          setFooter(data);
        }
      } catch (error) {
        console.warn('Failed to load footer data, using defaults:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooter();
  }, []);

  if (isLoading) {
    return null; // Don't render until loaded
  }

  return (
    <footer className="py-4" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid rgba(63, 63, 143, 0.3)' }}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center gap-5 mb-4">
          <div style={{ maxWidth: '240px' }}>
            <h6 className="mb-2">
              <i className="bi bi-broadcast me-2"></i>{footer.section_about}
            </h6>
            <p className="text-muted small mb-0">
              {footer.description}
            </p>
          </div>
          <div>
            <h6 className="mb-2">{footer.section_quick}</h6>
            <ul className="list-unstyled small mb-0">
              {footer.quick_links && footer.quick_links.map((link) => (
                <li key={link.title} className="mb-1">
                  <a
                    href={link.url}
                    style={{
                      color: isActive(link.url) ? '#17a2b8' : 'var(--color-accent)',
                      transition: 'color 0.3s ease'
                    }}
                    {...(link.is_external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-2">{footer.section_network}</h6>
            <ul className="list-unstyled small mb-0">
              {footer.network_links && footer.network_links.map((link) => (
                <li key={link.title} className="mb-1">
                  <a
                    href={link.url}
                    className="text-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-2">{footer.section_contact}</h6>
            <p className="text-muted small mb-1"><i className="bi bi-telephone me-2"></i>{footer.phone}</p>
            <p className="text-muted small mb-1"><i className="bi bi-envelope me-2"></i>{footer.email}</p>
            <p className="text-muted small mb-0"><i className="bi bi-geo-alt me-2"></i>{footer.address}</p>
          </div>
        </div>

        <hr className="my-3" style={{ borderColor: 'rgba(63, 63, 143, 0.3)' }} />

        <div className="text-center py-2">
          <p className="text-muted small mb-0">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
