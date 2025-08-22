import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Save, 
  X,
  Camera,
  Settings,
  CreditCard,
  BarChart3,
  Calendar,
  Award,
  Wifi,
  Car,
  Coffee,
  Utensils
} from 'lucide-react';

export default function HotelProfile({ account }) {
  const [isEditing, setIsEditing] = useState(false);
  const [hotelInfo, setHotelInfo] = useState({
    name: 'Grand Luxury Hotel',
    description: 'Experience unparalleled luxury in the heart of the city. Our 5-star hotel offers world-class amenities, stunning views, and exceptional service.',
    address: '123 Luxury Avenue, Downtown, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@grandluxuryhotel.com',
    website: 'www.grandluxuryhotel.com',
    rating: 4.8,
    totalReviews: 1247,
    avatar: null,
    amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa', 'Gym', 'Pool']
  });

  const [financialStats] = useState({
    totalRevenue: 284500,
    monthlyRevenue: 45200,
    totalBookings: 1247,
    averageRating: 4.8,
    occupancyRate: 87,
    averageRoomRate: 285
  });

  const [verificationStatus] = useState({
    isVerified: true,
    verificationDate: '2024-01-15',
    documentsSubmitted: true,
    backgroundCheck: true,
    insuranceValid: true,
    licenseValid: true
  });

  const [recentMetrics] = useState([
    {
      id: 1,
      metric: 'Occupancy Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      period: 'This month'
    },
    {
      id: 2,
      metric: 'Average Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      period: 'This month'
    },
    {
      id: 3,
      metric: 'Revenue',
      value: '$45,200',
      change: '+12%',
      trend: 'up',
      period: 'This month'
    },
    {
      id: 4,
      metric: 'Bookings',
      value: '124',
      change: '+8%',
      trend: 'up',
      period: 'This month'
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
  };

  const getVerificationIcon = (isValid) => {
    return isValid ? 
      <CheckCircle className="w-5 h-5 text-green-400" /> : 
      <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Hotel Profile</h1>
        <p className="text-slate-300">Manage your hotel information and view performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Hotel Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Hotel Profile Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Hotel Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Hotel Avatar & Basic Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center">
                  {hotelInfo.avatar ? (
                    <img src={hotelInfo.avatar} alt="Hotel" className="w-20 h-20 rounded-2xl object-cover" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{hotelInfo.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-medium">{hotelInfo.rating}</span>
                  </div>
                  <span className="text-slate-400 text-sm">({hotelInfo.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                <div className="flex-1">
                  <label className="text-sm text-slate-400">Address</label>
                  {isEditing ? (
                    <textarea
                      value={hotelInfo.address}
                      onChange={(e) => setHotelInfo({...hotelInfo, address: e.target.value})}
                      rows="2"
                      className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none"
                    />
                  ) : (
                    <p className="text-white">{hotelInfo.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <label className="text-sm text-slate-400">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={hotelInfo.phone}
                      onChange={(e) => setHotelInfo({...hotelInfo, phone: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="text-white">{hotelInfo.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <label className="text-sm text-slate-400">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={hotelInfo.email}
                      onChange={(e) => setHotelInfo({...hotelInfo, email: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="text-white">{hotelInfo.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <label className="text-sm text-slate-400">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={hotelInfo.website}
                      onChange={(e) => setHotelInfo({...hotelInfo, website: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="text-white">{hotelInfo.website}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Verification Status</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  {getVerificationIcon(verificationStatus.isVerified)}
                  <div>
                    <h3 className="font-semibold text-white">Account Verified</h3>
                    <p className="text-slate-400 text-sm">Verified on {verificationStatus.verificationDate}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  verificationStatus.isVerified ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                }`}>
                  {verificationStatus.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-300 text-sm">Documents Submitted</span>
                  {getVerificationIcon(verificationStatus.documentsSubmitted)}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-300 text-sm">Background Check</span>
                  {getVerificationIcon(verificationStatus.backgroundCheck)}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-300 text-sm">Insurance Valid</span>
                  {getVerificationIcon(verificationStatus.insuranceValid)}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-300 text-sm">License Valid</span>
                  {getVerificationIcon(verificationStatus.licenseValid)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Stats */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Financial Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-semibold text-white">Total Revenue</h3>
                </div>
                <div className="text-2xl font-bold text-green-400">${financialStats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">Monthly Revenue</h3>
                </div>
                <div className="text-2xl font-bold text-sky-400">${financialStats.monthlyRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">Total Bookings</h3>
                </div>
                <div className="text-2xl font-bold text-purple-400">{financialStats.totalBookings}</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">Avg Rating</h3>
                </div>
                <div className="text-2xl font-bold text-yellow-400">{financialStats.averageRating}</div>
              </div>
            </div>
          </div>

          {/* Recent Metrics */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-white">{metric.metric}</h3>
                    <p className="text-slate-400 text-sm">{metric.period}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{metric.value}</div>
                    <div className="flex items-center gap-1 text-sm">
                      {getTrendIcon(metric.trend)}
                      <span className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Management Tools */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <div>
                    <h3 className="font-semibold text-white">Analytics Dashboard</h3>
                    <p className="text-slate-400 text-sm">View detailed performance metrics</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                  View
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-semibold text-white">Hotel Settings</h3>
                    <p className="text-slate-400 text-sm">Configure hotel preferences</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">Payment Settings</h3>
                    <p className="text-slate-400 text-sm">Manage payment methods</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-white">Certifications</h3>
                    <p className="text-slate-400 text-sm">View and manage certifications</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
