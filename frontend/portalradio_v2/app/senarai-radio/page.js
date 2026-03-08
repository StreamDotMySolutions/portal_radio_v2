import RadioStations from '@/components/RadioStations';

export const metadata = {
  title: 'Senarai Radio — PortalRadio RTM',
};

export default function SenariRadioPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 1.5rem 4rem' }}>
      <div className="container">
        <RadioStations />
      </div>
    </main>
  );
}
