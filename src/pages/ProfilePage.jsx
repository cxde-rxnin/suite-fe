import React, { useState, useEffect } from 'react';
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
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      hotelId: 'hotel1',
      name: 'Grand Luxury Hotel',
      location: 'New York, NY',
      rating: 4.8,
      totalReviews: 1247,
      price: 285,
      image: null,
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa'],
      description: 'Experience unparalleled luxury in the heart of the city. Our 5-star hotel offers world-class amenities and stunning views.',
      lastVisited: '2 weeks ago',
      isBookmarked: true
    },
    {
      id: 2,
      hotelId: 'hotel2',
      name: 'Seaside Resort & Spa',
      location: 'Miami, FL',
      rating: 4.6,
      totalReviews: 892,
      price: 320,
      image: null,
      amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant'],
      description: 'Beachfront luxury resort with stunning ocean views and world-class spa facilities.',
      lastVisited: '1 month ago',
      isBookmarked: true
    },
    {
      id: 3,
      hotelId: 'hotel3',
      name: 'Mountain Lodge Retreat',
      location: 'Denver, CO',
      rating: 4.7,
      totalReviews: 567,
      price: 195,
      image: null,
      amenities: ['Mountain View', 'Hiking Trails', 'Restaurant', 'Fireplace'],
      description: 'Cozy mountain lodge with breathtaking views and outdoor adventure activities.',
      lastVisited: '3 months ago',
      isBookmarked: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredFavorites = favorites
    .filter(favorite => {
      const matchesSearch = favorite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           favorite.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'recent' && favorite.lastVisited.includes('week')) ||
                           (filterType === 'high-rated' && favorite.rating >= 4.5);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'recent':
          return a.lastVisited.localeCompare(b.lastVisited);
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
        {filteredFavorites.length === 0 ? (
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
            {filteredFavorites.map((favorite, index) => (
              <div 
                key={favorite.id}
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-sky-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hotel Image */}
                <div className="h-48 bg-slate-700 relative">
                  {favorite.image ? (
                    <img 
                      src={favorite.image} 
                      alt={favorite.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-slate-500" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeFavorite(favorite.hotelId)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{favorite.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{favorite.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{favorite.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{favorite.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {favorite.amenities.slice(0, 3).map((amenity, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {favorite.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
                        +{favorite.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">${favorite.price}</div>
                      <div className="text-slate-400 text-sm">per night</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewHotel(favorite.hotelId)}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => bookHotel(favorite.hotelId)}
                        className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Book
                      </button>
                    </div>
                  </div>

                  {/* Last Visited */}
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Last visited: {favorite.lastVisited}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
