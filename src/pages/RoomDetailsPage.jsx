import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { LoaderCircle, ArrowLeft, BedDouble, Users, Bath, Ruler, Layers, Eye, Tag, PawPrint, Cigarette, Accessibility, Wifi, AirVent, Tv, Refrigerator, Building, ConciergeBell, Sparkles, Phone } from 'lucide-react';

// BookRoomPageButton navigates to booking page
function BookRoomPageButton({ hotelId, roomId }) {
  const navigate = useNavigate();
  return (
    <button
      className="w-full py-3 px-6 rounded-lg font-bold bg-sky-500 hover:bg-sky-600 text-white transition"
      onClick={() => navigate(`/hotels/${hotelId}/rooms/${roomId}/book`)}
    >
      Book this room
    </button>
  );
}

function RoomDetailsPage() {
  // Lucide icon mapping for amenities
  const amenityIcons = {
    wifi: <Wifi className="w-5 h-5 text-white mr-1" />,
    ac: <AirVent className="w-5 h-5 text-white mr-1" />,
    tv: <Tv className="w-5 h-5 text-white mr-1" />,
    minibar: <Refrigerator className="w-5 h-5 text-white mr-1" />,
    balcony: <Building className="w-5 h-5 text-white mr-1" />,
    'room-service': <ConciergeBell className="w-5 h-5 text-white mr-1" />,
    'daily-housekeeping': <Sparkles className="w-5 h-5 text-white mr-1" />,
    telephone: <Phone className="w-5 h-5 text-white mr-1" />,
  };
  
  const { hotelId, roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hotels/room/${roomId}`);
        if (!res.ok) throw new Error('Room not found');
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        setError(err.message);
        setRoom(null);
      }
      setIsLoading(false);
    }
    fetchRoom();
  }, [hotelId, roomId]);

  return (
    <div className="flex w-full flex-1 flex-col min-h-screen bg-slate-900 overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full sm:px-6 py-6 px-4 overflow-x-hidden">
        <div className="mt-20 mx-auto w-full">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-sky-400">
              <LoaderCircle className="animate-spin h-12 w-12 mb-4" />
              <p className="text-lg">Loading room details...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-center text-red-400 text-lg font-semibold">{error}</p>
            </div>
          ) : room ? (
            <>
              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="mb-6 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* Room Header with background image */}
              <div
                className="mb-8 relative rounded-2xl overflow-hidden w-full h-64 flex items-end justify-start border border-slate-700 shadow-lg"
                style={{
                  backgroundImage:
                    room.images && room.images.length > 0 && room.images[0].imageUrl
                      ? `url(${room.images[0].imageUrl})`
                      : hotelImage
                        ? `url(${hotelImage})`
                        : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '16rem',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
                <div className="relative z-10 p-8">
                  <h1 className="text-4xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2 break-words">
                    {room.name}
                  </h1>
                  <p className="text-sky-400 font-mono text-lg">
                    {room.pricePerDay ? `${room.pricePerDay} SUI / day` : 'Price: N/A'}
                  </p>
                </div>
              </div>

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full overflow-hidden">
                {/* Room Details */}
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl shadow-xl p-6 overflow-hidden">
                  <h2 className="text-2xl font-bold text-sky-400 mb-4">Room Description</h2>
                  {room.description ? (
                    <p className="text-slate-300 text-base leading-relaxed mb-6 break-words">
                      {room.description}
                    </p>
                  ) : (
                    <p className="text-slate-400 mb-6">No description available.</p>
                  )}

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Amenities</h3>
                    <ul className="list-none flex flex-wrap gap-4 text-slate-300 max-w-xl">
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.map((amenity, idx) => (
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

                  {/* Room Details Section */}
                  <div className="mt-6 grid grid-cols-2 gap-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Beds:</span> {Array.isArray(room.bedConfiguration) ? room.bedConfiguration.reduce((sum, bed) => sum + (bed.quantity || 0), 0) : 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Base Guests:</span> {room.baseGuestCount ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Bathrooms:</span> {room.bathrooms ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Room Size:</span> {room.roomSize ? `${room.roomSize} m²` : 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Floor:</span> {room.floor ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">View:</span> {room.view ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Type:</span> {room.type ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <PawPrint className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Pets Allowed:</span> {room.petsAllowed ? 'Yes' : 'No'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Cigarette className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Smoking Allowed:</span> {room.smokingAllowed ? 'Yes' : 'No'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Accessibility className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">Accessible:</span> {room.isAccessible ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="bg-slate-800 rounded-2xl shadow-xl p-6 h-fit">
                  <h2 className="text-xl font-bold text-sky-400 mb-4">Booking</h2>
                  {room.is_booked ? (
                    <div className="text-gray-300 mb-4">This room is currently booked.</div>
                  ) : (
                    <div className="text-white mb-4">This room is available for booking.</div>
                  )}
                  {room.is_booked ? (
                    <button
                      className="w-full py-3 px-6 rounded-lg font-bold bg-gray-400 text-white cursor-not-allowed"
                      disabled
                    >
                      Booked
                    </button>
                  ) : (
                    <BookRoomPageButton hotelId={hotelId} roomId={room.objectId} />
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default RoomDetailsPage;