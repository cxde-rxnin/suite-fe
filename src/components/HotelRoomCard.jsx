import { Link } from 'react-router-dom';
import { BedDouble, BadgeDollarSign, Info, Ban, Star, User } from 'lucide-react';
import BookingInfoModal from './BookingInfoModal';
import EditRoomModal from './EditRoomModal';
import { useState } from 'react';

function HotelRoomCard(props) {
  const {
    name,
    roomNumber,
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
    onViewDetails,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  function handleViewDetails() {
    if (onViewDetails) {
      onViewDetails();
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setBookingData(null);
    setLoadingBooking(false);
  }

  function handleSaveRoomEdit(updatedRoom) {
    // This would typically be handled by the parent component
    console.log('Room updated:', updatedRoom);
    handleCloseModal();
  }

  // Get the primary image
  const primaryImage = images && images.length > 0 ? images[0] : hotelImage;

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
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
        <div className="w-full flex flex-col items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white break-words w-full whitespace-normal group-hover:text-sky-400 transition-colors">
            {name || 'Room'}
          </h3>
          <h4 className="text-xs font-regular text-slate-400">
            Room No. {roomNumber || 'N/A'}
          </h4>
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
        <button
          className={`mt-auto py-3 px-4 rounded-xl font-semibold ${
            isBooked 
              ? 'bg-sky-500 text-white border border-slate-600' 
              : 'bg-sky-500 hover:bg-sky-600 text-white hover:shadow-lg hover:shadow-sky-500/25'
          } text-center flex items-center justify-center gap-2 transition-all duration-200`}
          onClick={handleViewDetails}
        >
          <Info className="w-4 h-4" />
          View Details
        </button>
      </div>

      {/* Modals */}
      {!isBooked && (
        <EditRoomModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          roomData={props}
          onSave={handleSaveRoomEdit}
        />
      )}
      
      {isBooked && (
        <BookingInfoModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          bookingData={bookingData}
          loading={loadingBooking}
        />
      )}
    </div>
  );
}

export default HotelRoomCard;