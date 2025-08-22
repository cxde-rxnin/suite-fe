
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { LoaderCircle, MapPin, ArrowLeft } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAppStore } from '../store/appStore';

function HotelDetailsPage() {
  const currentAccount = useCurrentAccount();
  const favoriteRoomIds = useAppStore(state => state.favoriteRoomIds);
  const fetchFavorites = useAppStore(state => state.fetchFavorites);
  const addFavorite = useAppStore(state => state.addFavorite);
  const removeFavorite = useAppStore(state => state.removeFavorite);

  useEffect(() => {
    if (currentAccount?.address) fetchFavorites(currentAccount.address);
  }, [currentAccount, fetchFavorites]);
  // Lucide icon mapping for amenities
  const amenityIcons = {
    wifi: <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.5 16.15a6 6 0 0 1 7 0"/><path d="M2 8.05a16 16 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>,
    ac: <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="8" rx="4"/><line x1="4" y1="8" x2="4" y2="16"/><line x1="20" y1="8" x2="20" y2="16"/></svg>,
    tv: <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>,
    minibar: <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
    balcony: <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    'room-service': <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2"/><path d="M12 3v6"/><path d="M8 9h8"/></svg>,
    'daily-housekeeping': <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21v-7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7"/><path d="M12 3v6"/><path d="M8 9h8"/></svg>,
    telephone: <svg className="w-5 h-5 text-sky-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.25.72 3.32a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.07.35 2.19.59 3.32.72a2 2 0 0 1 1.72 2z"/></svg>,
  };
  const location = useLocation();
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [isLoading, setIsLoading] = useState(!location.state?.hotel);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState(location.state?.rooms || []);
  const [roomsLoading, setRoomsLoading] = useState(!location.state?.rooms);
  const [roomsError, setRoomsError] = useState(null);

  useEffect(() => {
    async function fetchHotel() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hotels/${hotelId}`);
        if (!res.ok) throw new Error('Hotel not found');
        const data = await res.json();
        setHotel(data);
      } catch (err) {
        setError(err.message);
        setHotel(null);
      }
      setIsLoading(false);
    }
    if (!location.state?.hotel) {
      fetchHotel();
    }
    if (!location.state?.rooms) {
      async function fetchRooms() {
        setRoomsLoading(true);
        setRoomsError(null);
        try {
          const res = await fetch(`/api/hotels/${hotelId}/rooms`);
          if (!res.ok) throw new Error('Could not fetch rooms');
          const data = await res.json();
          setRooms(data);
        } catch (err) {
          setRoomsError(err.message);
          setRooms([]);
        }
        setRoomsLoading(false);
      }
      fetchRooms();
    }
  }, [hotelId, location.state]);

  return (
    <div className="w-full px-4">
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center h-64">
          <LoaderCircle className="animate-spin h-12 w-12 mb-4 text-sky-400" />
          <span className="text-slate-400">Loading hotel details...</span>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-red-400 text-lg font-semibold">{error}</div>
        </div>
      ) : hotel ? (
        <>
          {/* Back Button */}
          <button className=" mb-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition w-fit flex items-center gap-2">
            <Link to="/hotels" className="flex items-center gap-2">
              <ArrowLeft size={20} /> Back
            </Link>
          </button>
          {/* Hero Image Section */}
          <div className="relative w-full overflow-hidden shadow-2xl rounded-lg mb-8">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-96 object-cover bg-slate-700"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent px-4 py-3 flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{hotel.name}</h1>
                <div className="flex items-center gap-2 text-white mb-2">
                  <MapPin size={22} />
                  <span className="font-mono text-lg">{hotel.physicalAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full bg-slate-800 rounded-2xl shadow-xl p-4 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">About this hotel</h2>
            {(hotel.description && hotel.description.trim() !== "") ? (
              <p className="text-slate-300 text-lg mb-6">{hotel.description}</p>
            ) : (
              <p className="text-slate-400 mb-6">No description available.</p>
            )}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-2">Amenities</h3>
              <ul className="list-none flex flex-wrap gap-4 text-slate-300">
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  hotel.amenities.map((amenity, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {amenityIcons[amenity] || null}
                      <span>{amenity}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">No amenities listed.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="w-full p-4 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Rooms</h2>
            {roomsLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoaderCircle className="animate-spin h-8 w-8 text-sky-400" />
                <span className="ml-2 text-slate-400">Loading rooms...</span>
              </div>
            ) : roomsError ? (
              <div className="text-center text-red-400">{roomsError}</div>
            ) : rooms.length === 0 ? (
              <div className="text-center text-slate-400">No rooms available for this hotel.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => (
                  <RoomCard
                    key={room.objectId}
                    {...room}
                    hotelId={hotel.objectId}
                    hotelImage={hotel.imageUrl}
                    userId={currentAccount?.address || ''}
                    isFavorite={favoriteRoomIds.includes(room.objectId)}
                    addFavorite={addFavorite}
                    removeFavorite={removeFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default HotelDetailsPage;
