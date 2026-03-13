import { notFound } from 'next/navigation';
import { fetchStationBySlug } from '@/utils/stationsApi';
import Responsive from '@/components/Responsive';
import StationDetail from '@/components/StationDetail';
import StationDetailMobile from '@/components/StationDetail.mobile';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const station = await fetchStationBySlug(slug);
  if (!station) return {};
  const title = `${station.name} — PortalRadio RTM`;
  const description = station.description || `Dengar ${station.name} secara langsung di PortalRadio RTM`;
  const image = station.heroBanner || station.banner || '/og-image.png';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/station/${slug}`,
      images: [{ url: image, alt: station.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function StationPage({ params }) {
  const { slug } = await params;
  const station = await fetchStationBySlug(slug);
  if (!station) notFound();
  return <Responsive mobile={StationDetailMobile} desktop={StationDetail} station={station} />;
}
