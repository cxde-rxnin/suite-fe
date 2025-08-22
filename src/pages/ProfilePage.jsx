import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { 
  Heart, 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Search,
  Filter,
  Trash2,
  Eye,
  BookOpen,
  Building2
} from 'lucide-react';

const ProfilePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    async function fetchFavoritesAndRooms() {
      if (!currentAccount?.address) return;
      setLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/hotels/favorites?userId=${currentAccount.address}`);
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        setFavorites(data);
        // Fetch room data for each favorite
        const roomPromises = data.map(fav =>
          fetch(`/api/hotels/room/${fav.roomId}`).then(r => r.ok ? r.json() : null)
        );
        const roomResults = await Promise.all(roomPromises);
        setRooms(roomResults.filter(Boolean));
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFavoritesAndRooms();
  }, [currentAccount]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredRooms = rooms
    .filter(room => {
      const name = room.name || '';
      const location = room.location || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.toLowerCase().includes(searchTerm.toLowerCase());
      const rating = typeof room.rating === 'number' ? room.rating : 0;
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'high-rated' && rating >= 4.5);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.pricePerDay || 0) - (b.pricePerDay || 0);
        default:
          return 0;
      }
    });

  const removeFavorite = (hotelId) => {
    setFavorites(favorites.filter(fav => fav.hotelId !== hotelId));
  };

  const viewHotel = (hotelId) => {
    // Navigate to hotel details page
    window.location.href = `/hotels/${hotelId}`;
  };

  const bookHotel = (hotelId) => {
    // Navigate to booking page
    window.location.href = `/hotels/${hotelId}`;
  };

  return (
    <div className="w-full px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
        <p className="text-slate-300">Your saved hotels and preferred destinations</p>
      </div>

      {/* Favorites Grid */}
      <div className="space-y-6">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No favorites found</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start exploring hotels and add them to your favorites to see them here'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <RoomCard
                key={room.objectId}
                {...room}
                hotelId={room.hotelId}
                hotelImage={room.hotelImage}
                userId={currentAccount?.address || ''}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;