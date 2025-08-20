import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { LoaderCircle, ArrowLeft } from 'lucide-react';

// BookRoomPageButton navigates to booking page
function BookRoomPageButton({ hotelId, roomId }) {
  const navigate = useNavigate();
  return (
    <button
      className="w-full py-3 px-6 rounded-lg font-bold bg-green-500 hover:bg-green-600 text-white transition"
      onClick={() => navigate(`/hotel/${hotelId}/rooms/${roomId}/book`)}
    >
      Book this room
    </button>
  );
}

function RoomDetailsPage() {
  const { hotelId, roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hotels/${hotelId}/rooms/${roomId}`);
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
    <div className="flex w-full flex-col min-h-screen bg-slate-900 overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">

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

              {/* Room Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-semibold text-white break-words drop-shadow-lg">
                  Room {room.objectId}
                </h1>
                <p className="text-sky-400 font-mono mt-2 break-words">
                  {room.price_per_day ? `${room.price_per_day} SUI / day` : 'Price: N/A'}
                </p>
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
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      <li>Free WiFi</li>
                      <li>Air Conditioning</li>
                      <li>Private Bathroom</li>
                      <li>Room Service</li>
                    </ul>
                  </div>
                </div>

                {/* Booking Panel */}
                <div className="bg-slate-800 rounded-2xl shadow-xl p-6 h-fit">
                  <h2 className="text-xl font-bold text-sky-400 mb-4">Booking</h2>
                  {room.is_booked ? (
                    <div className="text-gray-300 mb-4">This room is currently booked.</div>
                  ) : (
                    <div className="text-green-400 mb-4">This room is available for booking.</div>
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