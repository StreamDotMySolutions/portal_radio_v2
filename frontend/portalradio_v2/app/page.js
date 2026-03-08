import Responsive from '@/components/Responsive';
import Hero from '@/components/Hero';
import HeroMobile from '@/components/Hero.mobile';
import RadioStations from '@/components/RadioStations';
import RadioStationsMobile from '@/components/RadioStations.mobile';
import LiveStream from '@/components/LiveStream';
import LiveStreamMobile from '@/components/LiveStream.mobile';
import PromoPopup from '@/components/PromoPopup';

export default function Home() {
  return (
    <main>
      <PromoPopup />
      <Responsive mobile={HeroMobile} desktop={Hero} />
      <Responsive mobile={LiveStreamMobile} desktop={LiveStream} />
      <Responsive mobile={RadioStationsMobile} desktop={RadioStations} />
    </main>
  );
}
