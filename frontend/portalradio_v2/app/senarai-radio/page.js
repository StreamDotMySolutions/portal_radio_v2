import Responsive from '@/components/Responsive';
import RadioStations from '@/components/RadioStations';
import RadioStationsMobile from '@/components/RadioStations.mobile';

export const metadata = {
  title: 'Senarai Radio — PortalRadio RTM',
};

export default function SenariRadioPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 1.5rem 4rem' }}>
      <Responsive mobile={RadioStationsMobile} desktop={RadioStations} />
    </main>
  );
}
