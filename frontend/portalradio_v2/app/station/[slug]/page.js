import { notFound } from 'next/navigation';
import { fetchStationBySlug } from '@/utils/stationsApi';
import Responsive from '@/components/Responsive';
import StationDetail from '@/components/StationDetail';
import StationDetailMobile from '@/components/StationDetail.mobile';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const station = await fetchStationBySlug(slug);
  if (!station) return {};
  return {
    title: `${station.name} — PortalRadio RTM`,
    description: station.description,
  };
}

export default async function StationPage({ params }) {
  const { slug } = await params;
  const station = await fetchStationBySlug(slug);
  if (!station) notFound();
  return <Responsive mobile={StationDetailMobile} desktop={StationDetail} station={station} />;
}
