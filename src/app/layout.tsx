import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/global.css';
import Layout from '../components/Layout';
import { getSiteData } from '../data/siteData';

const siteData = getSiteData();

export const metadata: Metadata = {
  title: siteData.site.name,
  description: siteData.site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Layout siteData={siteData}>{children}</Layout>
      </body>
    </html>
  );
}