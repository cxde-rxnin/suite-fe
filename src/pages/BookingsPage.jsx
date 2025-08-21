import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, LoaderCircle } from 'lucide-react';
import apiClient from '../api/axios';

function BookingsPage() {
  const currentAccount = useCurrentAccount();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/reservations?address=${currentAccount?.address}`);
        setReservations(res.data);
      } catch (err) {
        setError('Failed to load reservations');
        setReservations([]);
      }
      setLoading(false);
    }
    if (currentAccount?.address) {
      fetchReservations();
    }
  }, [currentAccount]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  return (
    <div className="w-full px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-slate-300">Manage and track your hotel reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-sky-400" />
            <h3 className="text-lg font-semibold text-white">Total Bookings</h3>
          </div>
          <div className="text-3xl font-bold text-sky-400">{reservations.length}</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Confirmed</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {reservations.filter(r => r.status?.toLowerCase() === 'confirmed').length}
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Pending</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-400">
            {reservations.filter(r => r.status?.toLowerCase() !== 'confirmed' && r.status?.toLowerCase() !== 'cancelled').length}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="animate-spin h-12 w-12 text-sky-400" />
            <p className="text-slate-400">Loading your bookings...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Bookings</h3>
          <p className="text-red-400">{error}</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
          <p className="text-slate-400">Start exploring hotels and make your first booking!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation, index) => (
            <div 
              key={reservation.objectId} 
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">
                      Hotel ID: {reservation.hotelId}
                    </h3>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span>{reservation.status || 'Pending'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <span>Room ID: {reservation.roomId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      <span>
                        {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sky-400">
                      {reservation.price || 'N/A'} SUI
                    </div>
                    <div className="text-slate-400 text-sm">Total Amount</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
