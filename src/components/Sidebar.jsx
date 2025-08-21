import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarCheck2, Heart, Building2 } from 'lucide-react';

function Sidebar({ isConnected }) {
  const location = useLocation();
  
  // Show sidebar if isConnected is true (not null/undefined/false)
  if (!isConnected) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-slate-800 text-white z-30 flex-col items-center py-8 px-2 border-r border-slate-700">
        <nav className="flex flex-col gap-6 mt-40 items-center w-14 py-8 rounded-2xl">
          <Link
            to="/hotels"
            className={`hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              location.pathname === "/hotels" 
                ? "bg-sky-500 text-white shadow-lg" 
                : "hover:bg-slate-600"
            }`}
            title="Hotels"
          >
            <Building2 size={20} />
          </Link>
          <Link
            to="/hotels/bookings"
            className={`hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              location.pathname === "/hotels/bookings" 
                ? "bg-sky-500 text-white shadow-lg" 
                : "hover:bg-slate-600"
            }`}
            title="Bookings"
          >
            <CalendarCheck2 size={20} />
          </Link>
          <Link
            to="/hotels/favorites"
            className={`hover:text-sky-400 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              location.pathname === "/hotels/favorites" 
                ? "bg-sky-500 text-white shadow-lg" 
                : "hover:bg-slate-600"
            }`}
            title="Favorites"
          >
            <Heart size={20} />
          </Link>
        </nav>
      </aside>
      
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-slate-800 text-white shadow-2xl z-40 flex justify-around items-center border-t border-slate-700">
        <Link 
          to="/hotels" 
          className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            location.pathname === "/hotels" 
              ? "text-sky-400" 
              : "text-slate-400 hover:text-white"
          }`} 
          title="Hotels"
        >
          <Building2 size={24} />
          <span className="text-xs mt-1 font-medium">Hotels</span>
          {location.pathname === "/hotels" && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </Link>
        <Link 
          to="/hotels/bookings" 
          className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            location.pathname === "/hotels/bookings" 
              ? "text-sky-400" 
              : "text-slate-400 hover:text-white"
          }`} 
          title="Bookings"
        >
          <CalendarCheck2 size={24} />
          <span className="text-xs mt-1 font-medium">Bookings</span>
          {location.pathname === "/hotels/bookings" && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </Link>
        <Link 
          to="/hotels/favorites" 
          className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            location.pathname === "/hotels/favorites" 
              ? "text-sky-400" 
              : "text-slate-400 hover:text-white"
          }`} 
          title="Favorites"
        >
          <Heart size={24} />
          <span className="text-xs mt-1 font-medium">Favorites</span>
          {location.pathname === "/hotels/favorites" && (
            <span className="absolute bottom-2 w-8 h-1 bg-sky-400 rounded-full"></span>
          )}
        </Link>
      </nav>
    </>
  );
}

export default Sidebar;