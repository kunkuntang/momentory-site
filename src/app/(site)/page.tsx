import HomePage from '../../views/HomePage';
import { getSiteData } from '../../data/siteData';

export const revalidate = 3600;

export default async function Page() {
  const siteData = await getSiteData();
  return <HomePage siteData={siteData} />;
}
