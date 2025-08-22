import React from 'react';

function BookingInfoModal({ isOpen, onClose, bookingData, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold text-sky-400 mb-6">Booking Information</h2>
        {loading ? (
          <div className="text-sky-400 text-center py-8">Loading booking info...</div>
        ) : bookingData ? (
          <div className="space-y-2">
            <p><strong>User:</strong> {bookingData.userName}</p>
            <p><strong>Check-in:</strong> {bookingData.checkInDate}</p>
            <p><strong>Check-out:</strong> {bookingData.checkOutDate}</p>
            <p><strong>Status:</strong> {bookingData.status}</p>
            {/* Add more booking details as needed */}
          </div>
        ) : (
          <p className="text-slate-400">No booking data available.</p>
        )}
      </div>
    </div>
  );
}

export default BookingInfoModal;
