import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import axios from '../api/axios';

function StatCard({ title, value, icon: Icon, color, trend, change, subtitle }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 text-${color}-400`} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-slate-400 text-xs">{subtitle}</div>}
    </div>
  );
}

function TransactionList({ transactions }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <button className="text-sky-400 hover:text-sky-300 text-sm font-medium flex items-center gap-1 transition-colors">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tx.type === 'Check-in' ? 'bg-green-400' : 
                  tx.type === 'Check-out' ? 'bg-orange-400' : 'bg-sky-400'
                }`}></div>
                <div>
                  <div className="font-semibold text-white">{tx.type}</div>
                  <div className="text-slate-400 text-sm">Room {tx.room}</div>
                </div>
              </div>
              <div className="text-slate-400 text-sm">{tx.date}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotelHome() {
  // Get account from outlet context
  const { account } = useOutletContext();
  // Dashboard state
  const [occupancy, setOccupancy] = useState({
    rate: 0,
    comparison: 0,
    progress: 0,
  });
  const [revenue, setRevenue] = useState({
    today: 0,
    trend: 'up',
    change: 0,
    monthProgress: 0,
  });
  const [checkStats, setCheckStats] = useState({
    checkin: 0,
    checkout: 0,
    pendingArrivals: 0,
    pendingDepartures: 0,
  });
  const [rooms, setRooms] = useState({
    available: 0,
    clean: 0,
    dirty: 0,
    maintenance: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hotelName, setHotelName] = useState('Hotel');

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        console.log('Account:', account); // Debug log
        console.log('Hotel ID:', account?.hotel?.id); // Debug log
        
        let hotelId = account?.hotel?.id;
        let hotelNameFromDb = null;

        // If we don't have hotelId, try to fetch hotel by owner's address
        if (!hotelId && account?.address) {
          try {
            const searchRes = await axios.get(`/hotels?owner=${account.address}`);
            if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
              const firstHotel = searchRes.data[0];
              hotelId = firstHotel._id;
              hotelNameFromDb = firstHotel.name;
            }
          } catch (searchErr) {
            // Handle error (show toast, etc)
          }
        }

        // Always try to fetch hotel name if hotelId is available
        let resolvedHotelName = account?.hotel?.name || hotelNameFromDb;
        if (hotelId) {
          try {
            const hotelRes = await axios.get(`/hotels/${hotelId}`);
            if (hotelRes.data?.name) {
              resolvedHotelName = hotelRes.data.name;
            }
          } catch (err) {
            // fallback to previous resolvedHotelName
          }
        }
        setHotelName(resolvedHotelName || 'Hotel');

        // TODO: Implement these dashboard endpoints in the backend
        // const apiCalls = [
        //   axios.get('/api/hotel/occupancy'),
        //   axios.get('/api/hotel/revenue'),
        //   axios.get('/api/hotel/checkstats'),
        //   axios.get('/api/hotel/rooms'),
        // ];

        // const results = await Promise.all(apiCalls);

        // setOccupancy(results[0].data);
        // setRevenue(results[1].data);
        // setCheckStats(results[2].data);
        // setRooms(results[3].data);
        
      } catch (err) {
        console.error('Dashboard fetch error:', err); // Debug log
        // Handle error (show toast, etc)
      }
      setLoading(false);
    }
    
    fetchDashboard();
    // Optionally poll for real-time updates
    // const interval = setInterval(fetchDashboard, 30000);
    // return () => clearInterval(interval);
  }, [account]); // Add account as dependency

  return (
    <div className="w-full px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {hotelName}
        </h1>
        <p className="text-slate-300">Here's what's happening with your hotel today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Occupancy Rate" 
          value={`${occupancy.rate}%`} 
          icon={Users} 
          color="orange"
          trend={occupancy.comparison >= 0 ? 'up' : 'down'}
          change={Math.abs(occupancy.comparison)}
          subtitle="vs yesterday"
        />
        <StatCard 
          title="Daily Revenue" 
          value={`SUI ${revenue.today}`} 
          icon={DollarSign} 
          color="green"
          trend={revenue.trend}
          change={revenue.change}
          subtitle="today"
        />
        <StatCard 
          title="Check-ins" 
          value={checkStats.checkin} 
          icon={CheckCircle} 
          color="blue"
          subtitle={`${checkStats.pendingArrivals} pending`}
        />
        <StatCard 
          title="Check-outs" 
          value={checkStats.checkout} 
          icon={Calendar} 
          color="purple"
          subtitle={`${checkStats.pendingDepartures} pending`}
        />
      </div>

      {/* Rooms Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-green-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-white">Available</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">{rooms.available}</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-white">Clean</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400">{rooms.clean}</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-white">Dirty</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{rooms.dirty}</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-red-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-white">Maintenance</h3>
          </div>
          <div className="text-3xl font-bold text-red-400">{rooms.maintenance}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <TransactionList transactions={checkStats.transactions || []} />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}