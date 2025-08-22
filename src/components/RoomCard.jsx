import { Link } from 'react-router-dom';
import { BedDouble, BadgeDollarSign, Info, Ban, Star, User, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import BookRoomModal from './BookRoomModal';

function RoomCard(props) {
  const {
    name,
    description,
    images,
    pricePerDay,
    isBooked,
    objectId,
    hotelId,
    hotelImage,
    bedConfiguration,
    baseGuestCount,
    roomSize,
    bathrooms,
    rating = 4.6,
    isFavorite = false,
    userId,
  } = props;

  const [favorite, setFavorite] = useState(isFavorite);
  // Sync local state with prop
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  async function handleFavorite() {
    setLoading(true);
    setError(null);
    try {
      if (!userId) throw new Error('No userId');
      if (favorite) {
        await props.removeFavorite(objectId, userId);
      } else {
        await props.addFavorite(objectId, userId);
      }
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    } catch (err) {
      setError('Error updating favorite: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 hover:border-sky-500/50 p-0 flex flex-col relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {/* Room Image */}
      <div className="relative w-full h-48 bg-slate-700">
        <img
          src={(images && images.length > 0 && images[0].imageUrl) ? images[0].imageUrl : hotelImage}
          alt={name || 'Room'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
          <BadgeDollarSign className="w-4 h-4 text-sky-400" />
          {pricePerDay ? `${pricePerDay} SUI/day` : 'N/A'}
        </div>
        
        {/* Booked Badge */}
        {isBooked && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Ban className="w-4 h-4" />
            Booked
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm text-white text-sm font-semibold px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-white break-words whitespace-normal group-hover:text-sky-400 transition-colors">
            {name || 'Room'}
          </h3>
          <button
            className={`ml-2 p-1 rounded-full hover:bg-slate-700 relative ${loading ? 'cursor-wait opacity-70' : ''}`}
            onClick={loading ? undefined : handleFavorite}
            aria-label={favorite ? 'Remove from favorites' : 'Save to favorites'}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5 text-sky-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
              </svg>
            ) : (
              <Heart 
                className={`w-5 h-5 transition-transform duration-300 ${favorite ? 'text-pink-500 fill-pink-500' : 'text-slate-400'} ${animate ? 'scale-125' : ''}`}
                fill={favorite ? 'currentColor' : 'none'} 
              />
            )}
          </button>
        {error && (
          <div className="text-xs text-red-400 mb-2">{error}</div>
        )}
        </div>
        
        <p className="text-slate-400 text-sm mb-4 break-words">
          {description || 'Comfortable room with modern amenities and beautiful views.'}
        </p>
        
        {/* Room Features */}
        <div className="flex items-center gap-4 mb-4 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>
              {Array.isArray(bedConfiguration)
                ? `${bedConfiguration.reduce((sum, bed) => sum + (bed.quantity || 0), 0)} Bed${bedConfiguration.reduce((sum, bed) => sum + (bed.quantity || 0), 0) === 1 ? '' : 's'}`
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>
              {baseGuestCount ? `${baseGuestCount} Guest${baseGuestCount === 1 ? '' : 's'}` : 'N/A'}
            </span>
          </div>
        </div>
        
        {/* Action Button */}
        {isBooked ? (
          <button
            className="mt-auto py-3 px-4 rounded-xl font-semibold bg-slate-700 cursor-not-allowed text-slate-400 flex items-center justify-center gap-2 border border-slate-600"
            disabled
          >
            <Ban className="w-4 h-4" />
            Booked
          </button>
        ) : (
          <Link
            to={`/hotels/${hotelId}/rooms/${objectId}`}
            className="mt-auto py-3 px-4 rounded-xl font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 text-center flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-sky-500/25"
          >
            <Info className="w-4 h-4" />
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default RoomCard;