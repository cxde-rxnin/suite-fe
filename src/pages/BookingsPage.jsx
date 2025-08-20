import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Header from '../components/Header';
import apiClient from '../api/axios';

function BookingsPage() {
  const currentAccount = useCurrentAccount();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError(null);
      try {
        // Replace with your backend endpoint or Sui query
        const res = await apiClient.get(`/bookings?address=${currentAccount?.address}`);
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load bookings');
        setBookings([]);
      }
      setLoading(false);
    }
    if (currentAccount?.address) {
      fetchBookings();
    }
  }, [currentAccount]);

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col w-full">
      <Header />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>
        {loading ? (
          <div className="text-slate-400">Loading bookings...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-slate-400">No bookings found.</div>
        ) : (
          <ul className="space-y-6">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-slate-700 rounded-xl p-6 shadow border border-slate-600">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-lg text-white">Hotel: {booking.hotelName}</div>
                    <div className="text-slate-300">Room: {booking.roomName}</div>
                    <div className="text-slate-300">Dates: {booking.arrivalDate} - {booking.departureDate}</div>
                  </div>
                  <div className="text-sky-400 font-bold">Status: {booking.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
