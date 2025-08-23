import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import HotelCard from '../components/HotelCard';
import { LoaderCircle, Search, Filter, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

function HotelsPage() {
  const { hotels, isLoading, fetchHotels } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const filteredHotels = hotels.filter(hotel => 
    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.physicalAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

  // Fetch rooms for a hotel by id
  async function fetchRooms(hotelId) {
    try {
      const res = await apiClient.get(`/rooms?hotelId=${hotelId}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching rooms:', err);
      return [];
    }
  }

  // Handle hotel card click
  const handleHotelClick = async (hotel) => {
    const rooms = await fetchRooms(hotel.objectId || hotel._id);
    navigate(`/hotel/${hotel.objectId || hotel._id}`, { state: { hotel, rooms } });
  };

  return (
    <div className="w-full px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">All Hotels</h1>
        <p className="text-slate-300">Discover and book from our collection of premium hotels</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search hotels by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-end mb-6">
        <div className="text-slate-400 text-sm">
          Showing {filteredHotels.length} of {hotels.length} total
        </div>
      </div>

      {/* Hotels Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="animate-spin h-12 w-12 text-sky-400" />
            <p className="text-slate-400">Loading hotels...</p>
          </div>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No hotels found' : 'No hotels available'}
          </h3>
          <p className="text-slate-400">
            {searchTerm 
              ? `No hotels match "${searchTerm}". Try adjusting your search.`
              : 'Check back later for new hotel listings.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel, index) => (
            <div 
              key={hotel.objectId || hotel._id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleHotelClick(hotel)}
              role="button"
              tabIndex={0}
            >
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelsPage;
