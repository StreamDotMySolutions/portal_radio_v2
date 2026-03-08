export const metadata = {
  title: 'Mengenai Kami — PortalRadio RTM',
};

export default function MengenaiKamiPage() {
  return (
    <main style={{ minHeight: '60vh', padding: '6rem 1.5rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="section-heading" style={{ marginTop: '50px', marginBottom: '2rem' }}>Mengenai Kami</h1>
      <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, fontSize: '1.1rem' }}>
        RTM (Radio Televisyen Malaysia) adalah penyiar awam kebangsaan Malaysia di bawah Kementerian Komunikasi.
      </p>
    </main>
  );
}
