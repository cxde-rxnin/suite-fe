
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoaderCircle, MapPin, ArrowLeft } from 'lucide-react';
import RoomCard from '../components/RoomCard';

function HotelDetailsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchHotel();
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
  }, [hotelId]);

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
          <button onClick={() => window.history.back()} className=" mb-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition w-fit flex items-center gap-2">
            <ArrowLeft size={20} /> Back
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
            <h2 className="text-2xl font-bold text-sky-400 mb-4">About this hotel</h2>
            {(hotel.description && hotel.description.trim() !== "") ? (
              <p className="text-slate-300 text-lg mb-6">{hotel.description}</p>
            ) : (
              <p className="text-slate-400 mb-6">No description available.</p>
            )}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-2">Amenities</h3>
              <ul className="list-disc list-inside text-slate-300">
              {hotel.amenities && hotel.amenities.length > 0 ? (
                hotel.amenities.map((amenity, idx) => (
                  <li key={idx}>{amenity}</li>
                ))
              ) : (
                <li className="text-slate-400">No amenities listed.</li>
              )}
              </ul>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="w-full bg-slate-800 rounded-2xl shadow-xl p-4 mb-8">
            <h2 className="text-2xl font-bold text-sky-400 mb-6">Rooms</h2>
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
                  <RoomCard key={room.objectId} room={room} hotelId={hotel.objectId} hotelImage={hotel.imageUrl} />
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
