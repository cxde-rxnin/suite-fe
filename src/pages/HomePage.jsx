import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import HotelCard from '../components/HotelCard';
import { LoaderCircle, Search, MapPin, Star } from 'lucide-react';
import Header from '../components/Header';

function HomePage() {
  const { hotels, isLoading, fetchHotels } = useAppStore();

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover amazing hotels and book your next adventure with ease
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search hotels, destinations..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-sky-400 mb-2">{hotels.length}</div>
            <div className="text-slate-300">Hotels Available!</div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">4.8</div>
            <div className="text-slate-300">Average Rating</div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-slate-300">Customer Support</div>
          </div>
        </div>

        {/* Hotels Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Hotels</h2>
            <div className="text-slate-400 text-sm">
              {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <LoaderCircle className="animate-spin h-12 w-12 text-sky-400" />
                <p className="text-slate-400">Loading hotels...</p>
              </div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No hotels found</h3>
              <p className="text-slate-400">Check back later for new listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, index) => (
                <div 
                  key={hotel.objectId} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;