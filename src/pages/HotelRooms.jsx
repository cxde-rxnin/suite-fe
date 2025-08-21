import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, X, Hotel, Users, Calendar } from 'lucide-react';
import apiClient from '../api/axios';
import RoomCard from '../components/RoomCard';

export default function HotelRooms({ account }) {
  const { hotelId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ total: 0, available: 0, booked: 0 });

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        // Use hotelId from URL if available
        let id = hotelId;
        if (!id && account?.hotel?.id) {
          id = account.hotel.id;
        }
        if (!id && account?.address) {
          const res = await apiClient.get(`hotels?owner=${account.address}`);
          if (Array.isArray(res.data) && res.data.length > 0) {
            id = res.data[0]._id;
          }
        }
        if (id) {
          const roomRes = await apiClient.get(`hotels/${id}/rooms`);
          setRooms(roomRes.data || []);
          setAnalytics({
            total: roomRes.data.length,
            available: roomRes.data.filter(r => !r.is_booked && !r.is_maintenance).length,
            booked: roomRes.data.filter(r => r.is_booked).length,
          });
        }
      } catch (err) {
        setRooms([]);
      }
      setLoading(false);
    }
    fetchRooms();
  }, [account, hotelId]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="w-full mx-auto py-8 px-4 max-w-7xl">
        {/* Header Section (hidden when modal is open) */}
        {!showModal && (
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Hotel Rooms
                </h1>
                <p className="text-slate-300 text-lg">Manage and monitor your hotel's room inventory</p>
              </div>
              <button 
                className="group relative inline-flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowModal(true)}
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Room
              </button>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Hotel className="w-6 h-6 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">Total Rooms</h3>
            </div>
            <div className="text-3xl font-bold text-sky-400">{analytics.total}</div>
            <p className="text-slate-300 text-sm">All rooms in inventory</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Available</h3>
            </div>
            <div className="text-3xl font-bold text-green-400">{analytics.available}</div>
            <p className="text-slate-300 text-sm">Ready for booking</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Booked</h3>
            </div>
            <div className="text-3xl font-bold text-red-400">{analytics.booked}</div>
            <p className="text-slate-300 text-sm">Currently occupied</p>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Room Inventory</h2>
            <div className="text-slate-400 text-sm">
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 text-lg">Loading rooms...</p>
                </div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
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
                  key={room.objectId || room._id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RoomCard room={room} hotelId={room.hotel} hotelImage={room.hotelImage} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-lg transform transition-all duration-300 animate-modal-enter">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create New Room
                </h2>
                <p className="text-slate-400 text-sm mt-1">Add a new room to your hotel inventory</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors duration-200 group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
            
            <form
              className="space-y-6"
              onSubmit={async e => {
                e.preventDefault();
                // Collect form data
                const form = e.target;
                const data = {
                  name: form.name.value,
                  type: form.type.value,
                  price: Number(form.price.value),
                  status: form.status.value,
                };
                // TODO: Call API to create room
                // await apiClient.post('/rooms', { ...data, hotel: hotelId });
                setShowModal(false);
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Room Name/Number</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="e.g., Room 101, Deluxe Suite A" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Room Type</label>
                <input 
                  name="type" 
                  type="text" 
                  placeholder="e.g., Deluxe, Standard, Suite" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Price per Day (SUI)</label>
                <input 
                  name="price" 
                  type="number" 
                  placeholder="0.00" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Initial Status</label>
                <select 
                  name="status" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Create Room
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
