import { useCurrentAccount } from '@mysten/dapp-kit';
import Sidebar from './components/Sidebar';
import HotelSidebar from './components/HotelSidebar';
import { useLocation } from 'react-router-dom';

export function SidebarWrapper() {
  const currentAccount = useCurrentAccount();
  const location = useLocation();
  // Show HotelSidebar for /hotel and any /hotel/* routes, but not /hotels
  const isHotelRoute = location.pathname.startsWith('/hotel') && !location.pathname.startsWith('/hotels');

  if (isHotelRoute) return <HotelSidebar account={currentAccount} />;
  return <Sidebar isConnected={!!currentAccount} account={currentAccount} />;
}

export default SidebarWrapper;