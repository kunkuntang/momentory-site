import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../../styles/global.css';
import Layout from '../../components/Layout';
import { getSiteData } from '../../data/siteData';

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  return {
    title: siteData.site.name,
    description: siteData.site.tagline,
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const siteData = await getSiteData();
  return <Layout siteData={siteData}>{children}</Layout>;
}
