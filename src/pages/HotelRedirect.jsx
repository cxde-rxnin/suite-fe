import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import apiClient from '../api/axios';
import Hotel from './Hotel';

export default function HotelRedirect() {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function redirectIfHotelExists() {
      if (currentAccount?.address) {
        setChecking(true);
        try {
          // Always fetch from the database using the correct endpoint
          const res = await apiClient.get(`hotels?owner=${currentAccount.address}`);
          console.log('HotelRedirect API response:', res.data);
          if (Array.isArray(res.data) && res.data.length > 0) {
            const hotel = res.data[0];
            const id = hotel._id;
            console.log('HotelRedirect wallet:', currentAccount.address, 'Hotel owner:', hotel.owner, 'Hotel id:', id);
            // Only redirect if wallet address matches hotel owner
            if (id && hotel.owner && hotel.owner.toLowerCase() === currentAccount.address.toLowerCase()) {
              console.log('Redirecting to /hotel/' + id);
              navigate(`/hotel/${id}`);
              return;
            } else {
              console.log('Wallet does not match hotel owner, not redirecting.');
            }
          } else {
            console.log('No hotel found for wallet:', currentAccount.address);
          }
        } catch (err) {
          console.error('HotelRedirect API error:', err);
        }
        setChecking(false);
      }
    }
    redirectIfHotelExists();
  }, [currentAccount, navigate]);

  if (!currentAccount?.address) {
    return <Hotel />;
  }
  if (checking) {
    return <div className="flex flex-1 items-center justify-center h-screen text-slate-400">Loading...</div>;
  }
  // If connected but no hotel, show intro
  return <Hotel />;
}
