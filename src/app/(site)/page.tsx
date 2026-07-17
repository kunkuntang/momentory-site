import HomePage from '../../views/HomePage';
import { getSiteData } from '../../data/siteData';

export default async function Page() {
  const siteData = await getSiteData();
  return <HomePage siteData={siteData} />;
}
