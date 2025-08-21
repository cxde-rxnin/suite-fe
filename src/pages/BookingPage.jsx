import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowLeft, Users, Calendar, Mail, Phone, User } from 'lucide-react';
import Header from '../components/Header';
import apiClient from '../api/axios';
import { useParams } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { bookRoom } from '../services/bookingService';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useConnectWallet } from '@mysten/dapp-kit';
import { useSuiPaymentCoin } from '../hooks/useSuiPaymentCoin';
import { useSuiBalance } from '../hooks/useSuiBalance';
import { useValidSuiPaymentCoin } from '../hooks/useValidSuiPaymentCoin';

function BookingPage() {
  const [txStatus, setTxStatus] = useState('idle'); // idle | pending | success | error
  const [txError, setTxError] = useState('');
  const wallet = useConnectWallet();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [form, setForm] = useState({
    fullName: 'Obed Okemsinachi',
    email: 'obedokemsinachi@gmail.com',
    phone: '8124731527',
    countryCode: '+234',
    arrivalDate: '',
    departureDate: '',
    numberOfGuests: 1
  });
  const [errors, setErrors] = useState({});
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { hotelId, roomId } = useParams();
  const currentAccount = useCurrentAccount();
  const arrival = form.arrivalDate ? new Date(form.arrivalDate) : null;
  const departure = form.departureDate ? new Date(form.departureDate) : null;
  const nights = arrival && departure ? Math.max(1, Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24))) : 0;
  const serviceFee = room ? Math.round((room.price_per_day || 0) * 0.15) : 0;
  const subtotal = room ? (room.price_per_day || 0) * nights : 0;
  const total = subtotal + serviceFee;
  const { paymentCoinId, coinError } = useValidSuiPaymentCoin(total);
  const suiBalance = useSuiBalance();

  useEffect(() => {
    async function fetchSummary() {
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const [hotelRes, roomRes] = await Promise.all([
          apiClient.get(`/api/hotels/${hotelId}`),
          apiClient.get(`/api/hotels/${hotelId}/rooms/${roomId}`)
        ]);
        setHotel(hotelRes.data);
        setRoom(roomRes.data);
      } catch (err) {
        setSummaryError('Failed to load booking summary');
        setHotel(null);
        setRoom(null);
      }
      setSummaryLoading(false);
    }
    if (hotelId && roomId) {
      fetchSummary();
    }
  }, [hotelId, roomId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.arrivalDate) errs.arrivalDate = 'Required';
    if (!form.departureDate) errs.departureDate = 'Required';
    if (form.numberOfGuests < 1) errs.numberOfGuests = 'Must be at least 1';
    
    // Check if departure is after arrival
    if (form.arrivalDate && form.departureDate && form.departureDate <= form.arrivalDate) {
      errs.departureDate = 'Departure must be after arrival';
    }
    
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert('Booking submitted!');
    }
  };

  const handleContinue = e => {
    e.preventDefault();
    if (allFilled) setShowModal(true);
  };

  const handleBooking = async () => {
    setTxStatus('pending');
    setTxError('');
    try {
      const guestAddress = currentAccount?.address;
      const bookingData = {
        hotelId,
        roomId,
        arrivalDate: form.arrivalDate,
        departureDate: form.departureDate,
        paymentCoinId, // Keep this for now, the bookingService will handle it
        guestAddress,
        totalCost: total,
        guestInfo: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          numberOfGuests: form.numberOfGuests,
        },
        suiClient,
        signAndExecuteTransaction 
      };
      const result = await bookRoom(bookingData);
      setTxStatus('success');
      setShowModal(false);
      // Optionally: show bookings modal or card here
    } catch (err) {
      setTxStatus('error');
      setTxError(err?.message || 'Booking failed');
      console.error('Booking failed:', err);
    }
  };

  // Check if all required fields are filled
  const allFilled =
      form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.arrivalDate &&
      form.departureDate &&
      form.numberOfGuests >= 1;

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col w-full">
      {/* Wallet connection UI */}
      {!currentAccount?.address && (
        <div className="flex justify-center items-center py-8">
          <button
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-600 transition"
            onClick={() => wallet.connect()}
          >
            Connect Wallet
          </button>
        </div>
      )}
      {/* Transaction status UI */}
      {txStatus === 'pending' && (
        <div className="flex justify-center items-center py-4">
          <span className="text-blue-400 font-semibold">Booking transaction pending...</span>
        </div>
      )}
      {txStatus === 'success' && (
        <div className="flex justify-center items-center py-4">
          <span className="text-green-400 font-semibold">Booking successful!</span>
        </div>
      )}
      {txStatus === 'error' && (
        <div className="flex justify-center items-center py-4">
          <span className="text-red-400 font-semibold">{txError}</span>
        </div>
      )}
      {showModal && (
        <PaymentModal
          form={form}
          total={total}
          onClose={() => setShowModal(false)}
          onProceed={handleBooking}
          paymentCoinId={paymentCoinId}
          coinError={coinError}
        />
      )}
      {!showModal && <Header />}
      <div className="w-full h-fit max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 mx-auto px-4 pt-8 pb-8">
        {/* Header with Back Button */}
        <div className="col-span-full">
            <button 
                type="button" 
                onClick={() => window.history.back()} 
                className="group mb-6 px-6 py-3 bg-slate-700 text-white rounded-xl shadow-lg hover:bg-slate-600 transition-all duration-300 flex items-center gap-3 border border-slate-600"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" /> 
                Back
            </button>
        </div>

        {/* Booking Form */}
        <div className="bg-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600 col-span-1 lg:col-span-8 h-fit mb-0 lg:mb-0 pb-32 lg:pb-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Complete Your Booking</h1>
                <p className="text-slate-300">Fill in your details to secure your spot at this amazing event</p>
            </div>

            <div className="space-y-6">
                {/* Full Name */}
                <div className="group">
                    <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <User size={16} />
                        Full name *
                    </label>
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 bg-slate-600 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-slate-500 transition-all duration-300 ${
                            errors.fullName 
                                ? 'border-red-400 focus:ring-red-400' 
                                : 'border-slate-500 focus:ring-slate-400 focus:border-slate-400'
                        }`}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                        <div className="text-sm text-red-300 mt-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                            {errors.fullName}
                        </div>
                    )}
                </div>

                {/* Email */}
                <div className="group">
                    <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Mail size={16} />
                        Email address *
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 bg-slate-600 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-slate-500 transition-all duration-300 ${
                            errors.email 
                                ? 'border-red-400 focus:ring-red-400' 
                                : 'border-slate-500 focus:ring-slate-400 focus:border-slate-400'
                        }`}
                        placeholder="Enter your email address"
                    />
                    {errors.email && (
                        <div className="text-sm text-red-300 mt-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                            {errors.email}
                        </div>
                    )}
                </div>

                {/* Phone Number */}
                <div className="group">
                    <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Phone size={16} />
                        Phone number *
                    </label>
                    <div className="flex gap-3 flex-col md:flex-row">
                        <select
                            name="countryCode"
                            value={form.countryCode}
                            onChange={handleChange}
                            className="px-4 py-4 bg-slate-600 border border-slate-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 focus:bg-slate-500 transition-all duration-300"
                        >
                            <option value="+234" className="bg-slate-700 text-white">+234</option>
                            <option value="+1" className="bg-slate-700 text-white">+1</option>
                            <option value="+44" className="bg-slate-700 text-white">+44</option>
                        </select>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={`flex-1 px-4 py-4 bg-slate-600 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-slate-500 transition-all duration-300 ${
                                errors.phone 
                                    ? 'border-red-400 focus:ring-red-400' 
                                    : 'border-slate-500 focus:ring-slate-400 focus:border-slate-400'
                            }`}
                            placeholder="Enter phone number"
                        />
                    </div>
                    {errors.phone && (
                        <div className="text-sm text-red-300 mt-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                            {errors.phone}
                        </div>
                    )}
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Arrival Date */}
                    <div className="group">
                        <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Calendar size={16} />
                            Arrival date *
                        </label>
                        <input
                            name="arrivalDate"
                            type="date"
                            value={form.arrivalDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-4 bg-slate-600 border rounded-xl text-white focus:outline-none focus:ring-2 focus:bg-slate-500 transition-all duration-300 ${
                                errors.arrivalDate 
                                    ? 'border-red-400 focus:ring-red-400' 
                                    : 'border-slate-500 focus:ring-slate-400 focus:border-slate-400'
                            }`}
                        />
                        {errors.arrivalDate && (
                            <div className="text-sm text-red-300 mt-2 flex items-center gap-1">
                                <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                                {errors.arrivalDate}
                            </div>
                        )}
                    </div>

                    {/* Departure Date */}
                    <div className="group">
                        <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Calendar size={16} />
                            Departure date *
                        </label>
                        <input
                            name="departureDate"
                            type="date"
                            value={form.departureDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-4 bg-slate-600 border rounded-xl text-white focus:outline-none focus:ring-2 focus:bg-slate-500 transition-all duration-300 ${
                                errors.departureDate 
                                    ? 'border-red-400 focus:ring-red-400' 
                                    : 'border-slate-500 focus:ring-slate-400 focus:border-slate-400'
                            }`}
                        />
                        {errors.departureDate && (
                            <div className="text-sm text-red-300 mt-2 flex items-center gap-1">
                                <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                                {errors.departureDate}
                            </div>
                        )}
                    </div>
                </div>

                {/* Number of Guests */}
                <div className="group">
                    <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Users size={16} />
                        Number of guests *
                    </label>
                    <input
                        name="numberOfGuests"
                        type="number"
                        min="1"
                        value={form.numberOfGuests}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 bg-slate-600 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-slate-500 transition-all duration-300 ${
                            errors.numberOfGuests 
                                ? 'border-red-400 focus:ring-red-400' 
                                : 'border-slate-500 focus:ring-slate-400 focus:border-slate-400'
                        }`}
                        placeholder="Enter number of guests"
                    />
                    {errors.numberOfGuests && (
                        <div className="text-sm text-red-300 mt-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                            {errors.numberOfGuests}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Desktop Summary Panel */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-3xl shadow-2xl p-8 col-span-1 lg:col-span-4 hidden lg:flex flex-col border border-slate-700 h-fit">
          {summaryLoading ? (
            <div className="text-slate-400 text-center py-12">Loading booking summary...</div>
          ) : summaryError ? (
            <div className="text-red-400 text-center py-12">{summaryError}</div>
          ) : hotel && room ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold text-sky-400 tracking-tight">Booking Summary</h2>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            {/* Room Info */}
            <div className="mb-6 p-4 bg-slate-700 rounded-2xl border border-slate-600 flex flex-col gap-2">
                <h4 className="text-md font-semibold text-white mb-1 break-words overflow-wrap-anywhere">
                    Room: {room.name || room.objectId}
                </h4>
                <div className="flex items-center gap-2 text-slate-300 text-base flex-wrap">
                    <span className="break-words">
                        SUI {room.price_per_day?.toLocaleString()} / night
                    </span>
                </div>
            </div>
            {/* Booking Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-600">
                  <span className="text-slate-300 font-medium">Dates</span>
                  <span className="font-semibold text-white">{form.arrivalDate} - {form.departureDate}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-600">
                  <span className="text-slate-300 font-medium">Guests</span>
                  <span className="font-semibold text-white">{form.numberOfGuests}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-600">
                  <span className="text-slate-300 font-medium">Nights</span>
                  <span className="font-semibold text-white">{nights}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-600">
                  <span className="text-slate-300 font-medium">Room Subtotal</span>
                  <span className="font-semibold text-white">SUI {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-600">
                  <span className="text-slate-300 flex items-center gap-2 font-medium">Service Fee <span className="w-5 h-5 rounded-full border border-slate-400 text-xs flex items-center justify-center text-slate-400 font-bold">i</span></span>
                  <span className="font-semibold text-white">SUI {serviceFee.toLocaleString()}</span>
                </div>
              </div>
              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!allFilled}
                className={`w-full bg-blue-400 hover:bg-sky-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform ${!allFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Continue to Payment
              </button>
            </>
          ) : null}
        </div>

        {/* Mobile Total & Continue Button */}
        {!showModal && (
          <div className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-slate-700 px-6 py-5 border-t border-slate-600 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-lg font-bold text-white">SUI {total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleContinue}
              disabled={!allFilled}
              className={`w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform ${
                !allFilled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>
    </div>
);
}

export default BookingPage;