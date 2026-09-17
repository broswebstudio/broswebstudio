import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import { SERVICES } from '@/lib/data';

export const metadata: Metadata = {
  title: "Graphic Designing | Bro's WebStudio",
  description: 'Logos, social kits, and brand collateral for businesses and creators that need to look put-together.',
  alternates: {
    canonical: '/graphic-designing',
  },
};

export default function GraphicDesigning() {
  return <ServicePageTemplate cfg={SERVICES.graphic} />;
}
