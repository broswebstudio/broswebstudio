import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import { SERVICES } from '@/lib/data';

export const metadata: Metadata = {
  title: "College Major & Minor Projects | Bro's WebStudio",
  description: 'Submission-ready major & minor projects for students — built, documented, and explained so you can answer viva questions with confidence.',
};

export default function CollegeProjects() {
  return <ServicePageTemplate cfg={SERVICES.college} />;
}
