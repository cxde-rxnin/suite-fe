import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

function HotelCard({ hotel }) {
  return (
    <a href={`/hotels/${hotel.objectId}`} className="block">
      <motion.div
        className="bg-slate-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold">{hotel.name}</h3>
          <div className="flex items-center gap-2 text-slate-400 mt-2">
            <MapPin size={16} />
            <span>{hotel.physical_address}</span>
          </div>
        </div>
      </motion.div>
    </a>
  );
}

export default HotelCard;