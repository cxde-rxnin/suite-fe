import { motion } from 'framer-motion';
import { MapPin, Star, Users } from 'lucide-react';

function HotelCard({ hotel }) {
  return (
    <a href={`/hotels/${hotel.objectId}`} className="block group">
      <motion.div
        className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-sky-500/50 cursor-pointer transition-all duration-300"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="relative">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>4.8</span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
            {hotel.name}
          </h3>
          
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span className="text-sm">{hotel.physicalAddress}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Users className="w-4 h-4" />
              <span>{hotel.rooms?.length || 0} rooms</span>
            </div>
            
          </div>
        </div>
      </motion.div>
    </a>
  );
}

export default HotelCard;