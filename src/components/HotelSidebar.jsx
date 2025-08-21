import React from 'react';
import { Home, CalendarCheck2, BedDouble, User } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function HotelSidebar() {
  const currentAccount = useCurrentAccount();
  const [hotelId, setHotelId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchHotelId() {
      if (currentAccount?.address) {
        try {
          const res = await fetch(`/api/hotels?owner=${currentAccount.address}`);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setHotelId(data[0]._id || data[0].objectId);
          }
        } catch (err) {
          setHotelId(null);
        }
      }
    }
    fetchHotelId();
  }, [currentAccount]);

  // Fallback to /hotel if no hotelId
  const base = hotelId ? `/hotel/${hotelId}` : '/hotel';

  return (
    <>
      {/* Desktop Hotel Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-slate-800 text-white z-30 flex-col items-center py-8 px-2 border-r border-slate-700">
        <nav className="flex flex-col gap-6 mt-40 items-center w-14 py-8 rounded-2xl">
          <NavLink
            to={base}
            className={({ isActive }) => `hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-sky-500 text-white shadow-lg' : 'hover:bg-slate-600'
            }`}
            title="Dashboard"
            end
          >
            <Home size={20} />
          </NavLink>
          <NavLink
            to={`${base}/bookings`}
            className={({ isActive }) => `hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-sky-500 text-white shadow-lg' : 'hover:bg-slate-600'
            }`}
            title="Bookings"
          >
            <CalendarCheck2 size={20} />
          </NavLink>
          <NavLink
            to={`${base}/rooms`}
            className={({ isActive }) => `hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-sky-500 text-white shadow-lg' : 'hover:bg-slate-600'
            }`}
            title="Rooms"
          >
            <BedDouble size={20} />
          </NavLink>
          <NavLink
            to={`${base}/profile`}
            className={({ isActive }) => `hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-sky-500 text-white shadow-lg' : 'hover:bg-slate-600'
            }`}
            title="Profile"
          >
            <User size={20} />
          </NavLink>
        </nav>
      </aside>
      
      {/* Mobile Hotel Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-slate-800 text-white shadow-2xl z-40 flex justify-around items-center border-t border-slate-700">
        <NavLink
          to={base}
          className={({ isActive }) => `relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            isActive ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
          title="Dashboard"
          end
        >
          <Home size={24} />
          <span className="text-xs mt-1 font-medium">Dashboard</span>
          {({ isActive }) => isActive && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </NavLink>
        <NavLink
          to={`${base}/bookings`}
          className={({ isActive }) => `relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            isActive ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
          title="Bookings"
        >
          <CalendarCheck2 size={24} />
          <span className="text-xs mt-1 font-medium">Bookings</span>
          {({ isActive }) => isActive && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </NavLink>
        <NavLink
          to={`${base}/rooms`}
          className={({ isActive }) => `relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            isActive ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
          title="Rooms"
        >
          <BedDouble size={24} />
          <span className="text-xs mt-1 font-medium">Rooms</span>
          {({ isActive }) => isActive && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </NavLink>
        <NavLink
          to={`${base}/profile`}
          className={({ isActive }) => `relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            isActive ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
          title="Profile"
        >
          <User size={24} />
          <span className="text-xs mt-1 font-medium">Profile</span>
          {({ isActive }) => isActive && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </NavLink>
      </nav>
    </>
  );
}

export default HotelSidebar;
