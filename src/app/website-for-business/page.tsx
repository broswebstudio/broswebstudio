import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import { SERVICES } from '@/lib/data';

export const metadata: Metadata = {
  title: "Website Development for Business | Bro's WebStudio",
  description: 'Custom-designed websites for shop owners, founders, and consultants that bring in real enquiries.',
};

export default function WebsiteForBusiness() {
  return <ServicePageTemplate cfg={SERVICES.business} />;
}
