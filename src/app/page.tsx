import HomePage from '../views/HomePage';
import { getSiteData } from '../data/siteData';

export default function Page() {
  const siteData = getSiteData();
  return <HomePage siteData={siteData} />;
}