import { notFound } from 'next/navigation';
import { getStationBySlug, allStations } from '@/data/stations';
import Responsive from '@/components/Responsive';
import StationDetail from '@/components/StationDetail';
import StationDetailMobile from '@/components/StationDetail.mobile';

export async function generateStaticParams() {
  return allStations.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) return {};
  return {
    title: `${station.name} — PortalRadio RTM`,
    description: station.description,
  };
}

export default async function StationPage({ params }) {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) notFound();
  return <Responsive mobile={StationDetailMobile} desktop={StationDetail} station={station} />;
}
