import { useCurrentAccount } from '@mysten/dapp-kit';
import Sidebar from './components/Sidebar';

export function SidebarWrapper() {
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  
  return <Sidebar isConnected={isConnected} />;
}

export default SidebarWrapper;