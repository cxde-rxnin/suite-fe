import { Link } from 'react-router-dom';
import { BedDouble, BadgeDollarSign, Info, Ban, Star } from 'lucide-react';
import { useState } from 'react';
import BookRoomModal from './BookRoomModal';

function RoomCard({ room, hotelId, hotelImage }) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 hover:border-sky-500/50 p-0 flex flex-col relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {/* Room Image */}
      <div className="relative w-full h-48 bg-slate-700">
        <img
          src={room.imageUrl || hotelImage}
          alt={room.objectId || 'Room'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
          <BadgeDollarSign className="w-4 h-4 text-sky-400" />
          {room.price_per_day ? `${room.price_per_day} SUI/day` : 'N/A'}
        </div>
        
        {/* Booked Badge */}
        {room.is_booked && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Ban className="w-4 h-4" />
            Booked
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm text-white text-sm font-semibold px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>4.6</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-white break-words w-full whitespace-normal group-hover:text-sky-400 transition-colors">
            {room.objectId || 'Room'}
          </h3>
        </div>
        
        <p className="text-slate-400 text-sm mb-4 break-words flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
          <span>{room.description || 'Comfortable room with modern amenities and beautiful views.'}</span>
        </p>

        {/* Room Features */}
        <div className="flex items-center gap-4 mb-4 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>1 Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <span>•</span>
            <span>2 Guests</span>
          </div>
        </div>

        {/* Action Button */}
        {room.is_booked ? (
          <button
            className="mt-auto py-3 px-4 rounded-xl font-semibold bg-slate-700 cursor-not-allowed text-slate-400 flex items-center justify-center gap-2 border border-slate-600"
            disabled
          >
            <Ban className="w-4 h-4" />
            Booked
          </button>
        ) : (
          <Link
            to={`/hotel/${hotelId}/rooms/${room.objectId}`}
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
