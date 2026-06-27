import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/global.css';
import Layout from '../components/Layout';
import siteData from '../data/siteData';

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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
