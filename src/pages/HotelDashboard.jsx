import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import apiClient from '../api/axios';
import HotelRegisterInline from './HotelRegisterInline';
import Sidebar from '../SidebarWrapper';
import Hotel from './Hotel';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function HotelDashboard() {
  const currentAccount = useCurrentAccount();
  // Removed page state, now using nested routing
  const [hotelExists, setHotelExists] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkHotel() {
      if (!currentAccount?.address) {
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const res = await apiClient.get(`/hotels?owner=${currentAccount.address}`);
        setHotelExists(res.data && res.data.length > 0);
      } catch (err) {
        setHotelExists(false);
      }
      setChecking(false);
    }
    checkHotel();
  }, [currentAccount]);

  if (!currentAccount?.address) {
    return <Hotel />;
  }

  if (checking) {
    return <div className="flex flex-1 items-center justify-center h-screen text-slate-400">Loading...</div>;
  }

  if (hotelExists === false) {
    // Show registration UI (inline)
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center">
        <HotelRegisterInline account={currentAccount} onRegistered={() => setHotelExists(true)} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-screen bg-slate-900">
      <div className="w-full">
        <Header />
        <div className="flex">
          <Sidebar account={currentAccount} isHotelOwner={hotelExists} />
          <main className="w-full flex-1 md:ml-20 mt-20 pb-20 md:pb-0">
            <Outlet context={{ account: currentAccount }} />
          </main>
        </div>
      </div>
    </div>
  );
}
