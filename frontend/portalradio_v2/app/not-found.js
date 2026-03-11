import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        backgroundColor: 'var(--color-bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          404
        </h1>
        <h2 style={{ color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Halaman Tidak Dijumpai
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginBottom: '0.25rem' }}>
          PORTAL RADIO RTM
        </p>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Maaf, halaman yang anda cari tidak wujud atau telah dialihkan.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'opacity 0.2s',
          }}
        >
          Kembali ke Laman Utama
        </Link>
      </div>
    </main>
  );
}
