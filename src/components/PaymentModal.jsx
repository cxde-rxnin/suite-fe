import React from 'react';
import { X, User, Mail, Phone, Users, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useSuiBalance } from '../hooks/useSuiBalance';

const PaymentModal = ({ form, total, onClose, onProceed, paymentCoinId, coinError }) => {
  const suiBalance = useSuiBalance();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-700/50 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-8 pb-6 border-b border-slate-700/50">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white">Payment Summary</h2>
              <p className="text-slate-400 text-sm">Review your booking details</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-2">
          <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 px-3">
                  <User size={18} className="text-blue-400" />
                  Guest Information
              </h3>
              <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl">
                      <div className="flex items-center gap-6">
                          <div>
                              <div className="text-slate-400 text-xs uppercase tracking-wide">Full Name</div>
                              <div className="text-white font-medium">{form.fullName}</div>
                          </div>
                          <div>
                              <div className="text-slate-400 text-xs uppercase tracking-wide">Phone</div>
                              <div className="text-white font-medium">{form.countryCode} {form.phone}</div>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full">
                          <div className="w-full sm:w-auto break-words">
                              <div className="text-slate-400 text-xs uppercase tracking-wide">Email</div>
                              <div className="text-white font-medium break-words">{form.email}</div>
                          </div>
                          <div>
                              <div className="text-slate-400 text-xs uppercase tracking-wide">Number of Guests</div>
                              <div className="text-white font-medium">{form.numberOfGuests}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* <div className="mb-4 text-center">
            <span className="text-slate-400">Your SUI Balance:</span>
            <span className="text-lg font-bold text-sky-400 ml-2">
              {suiBalance !== null ? suiBalance.toLocaleString() : 'Loading...'} SUI
            </span>
          </div> */}
          {/* Remove coinError display, rely on bookingService for coin merging */}

          <div className="mb-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Total Amount</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                    SUI {total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onProceed}
              className={`w-full py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${suiBalance < total ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-600 text-white hover:shadow-blue-500/25'}`}
              disabled={suiBalance < total}
            >
              Complete Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;