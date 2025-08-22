import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Hotel, Plus, LoaderCircle } from 'lucide-react';
import HotelRoomCard from '../components/HotelRoomCard';
import EditRoomModal from '../components/EditRoomModal';
import BookingInfoModal from '../components/BookingInfoModal';
import RoomCreationModal from '../components/RoomCreationModal';
import apiClient from '../api/axios';

function HotelRooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit' or 'booking'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  function handleViewDetails(room) {
    setSelectedRoom(room);
    if (room.isBooked) {
      setModalType('booking');
      setLoadingBooking(true);
      fetch(`/api/hotels/room/${room.objectId || room._id}/booking`)
        .then(res => res.json())
        .then(data => {
          setBookingData(data);
          setLoadingBooking(false);
        })
        .catch(() => {
          setBookingData(null);
          setLoadingBooking(false);
        });
    } else {
      setModalType('edit');
    }
  }

  function handleCloseModal() {
    setSelectedRoom(null);
    setModalType(null);
    setBookingData(null);
    setLoadingBooking(false);
  }

  async function handleSaveRoomEdit(updatedRoom) {
    try {
      const res = await fetch(`/api/hotels/room/${selectedRoom.objectId || selectedRoom._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom),
      });
      if (!res.ok) throw new Error('Failed to update room');
      setRooms(prevRooms => prevRooms.map(r => (r.objectId === selectedRoom.objectId ? updatedRoom : r)));
      handleCloseModal();
    } catch (err) {
      alert('Error updating room: ' + err.message);
    }
  }

  useEffect(() => {
    async function fetchHotelAndRooms() {
      try {
        setLoading(true);
        setError(null);

        if (!hotelId) {
          setError('No hotel ID provided');
          setLoading(false);
          return;
        }

        // Backend handles both _id and objectId now
        const hotelRes = await apiClient.get(`/hotels/${hotelId}`);
        setHotel(hotelRes.data);

        const roomsRes = await apiClient.get(`/hotels/${hotelId}/rooms`);
        setRooms(roomsRes.data);

      } catch (err) {
        console.error('Error fetching hotel/rooms:', err);

        let errorMessage = 'Failed to load hotel data. Please try again.';

        if (err.response?.status === 400) {
          errorMessage = err.response?.data?.message ||
                        err.response?.data?.error ||
                        'Bad request - please check the hotel ID format';
        } else if (err.response?.status === 404) {
          errorMessage = 'Hotel not found. Please check the hotel ID.';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your connection.';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (hotelId) {
      fetchHotelAndRooms();
    }
  }, [hotelId]);

  const handleRoomCreated = (newRoom) => {
    setRooms(prevRooms => [...prevRooms, newRoom]);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Rooms</h1>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle className="w-12 h-12 text-sky-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading hotel and rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Rooms</h1>
        </div>
        <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Error Loading Hotel</h3>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Rooms</h1>
          {hotel && (
            <p className="text-slate-400 mt-1">{hotel.name}</p>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Create Room
        </button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-6">
                <Hotel className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No rooms found</h3>
              <p className="text-slate-400 text-center max-w-md">
                Get started by creating your first room. Click the "Create Room" button above to add rooms to your hotel.
              </p>
            </div>
          ) : (
            rooms.map((room, index) => (
              <div 
                key={room.objectId || room._id || index} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <HotelRoomCard 
                  {...room}
                  hotelId={hotel?.objectId || hotel?._id}
                  hotelImage={room.hotelImage || hotel?.imageUrl}
                  onViewDetails={() => handleViewDetails(room)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {modalType === 'edit' && selectedRoom && (
        <EditRoomModal
          isOpen={true}
          onClose={handleCloseModal}
          roomData={selectedRoom}
          onSave={handleSaveRoomEdit}
        />
      )}

      {modalType === 'booking' && selectedRoom && (
        <BookingInfoModal
          isOpen={true}
          onClose={handleCloseModal}
          bookingData={bookingData}
          loading={loadingBooking}
        />
      )}

      {showModal && hotel && (
        <RoomCreationModal 
          hotelId={hotel.objectId || hotel._id} 
          onClose={() => setShowModal(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
}

export default HotelRooms;