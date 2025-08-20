import { Link } from 'react-router-dom';
import { BedDouble, BadgeDollarSign, Info, Ban } from 'lucide-react';
import { useState } from 'react';
import BookRoomModal from './BookRoomModal';

function RoomCard({ room, hotelId, hotelImage }) {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl p-0 flex flex-col relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-2xl">
      {/* Room Image */}
      <div className="relative w-full h-40 bg-slate-800">
        <img
          src={room.imageUrl || hotelImage}
          alt={room.objectId || 'Room'}
          className="w-full h-full object-cover rounded-t-2xl"
        />
        {/* Price Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-sky-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          <BadgeDollarSign size={16} />
          {room.price_per_day ? `${room.price_per_day} SUI/day` : 'N/A'}
        </div>
        {/* Booked Badge */}
        {room.is_booked && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            <Ban size={16} /> Booked
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white break-words w-full whitespace-normal">{room.objectId || 'Room'}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4 break-words flex items-center gap-1">
          <Info size={16} className="inline text-sky-400" />
          {room.description || 'No description.'}
        </p>

        {/* Action Button */}
        {room.is_booked ? (
          <button
            className="mt-auto py-2 px-4 rounded-lg font-bold bg-gray-400 cursor-not-allowed text-white flex items-center justify-center gap-2"
            disabled
          >
            <Ban size={18} /> Booked
          </button>
        ) : (
          <>
            <Link
              to={`/hotel/${hotelId}/rooms/${room.objectId}`}
              className="mt-2 py-2 px-4 rounded-lg font-bold bg-sky-400 hover:bg-sky-500 text-white transition text-center flex items-center justify-center gap-2"
            >
              <Info size={18} /> View details
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default RoomCard;
