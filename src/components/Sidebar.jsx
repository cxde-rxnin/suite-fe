import React from 'react';
import { Home, CalendarCheck2, User } from 'lucide-react';

function Sidebar({ isConnected }) {
  if (!isConnected) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-slate-900 text-white z-30 flex-col items-center py-8 px-2 geist-mono">
        <nav className="flex flex-col gap-10 mt-40 items-center bg-slate-800/50 backdrop-blur-sm border-2 border-white/20 w-9/12 py-10 rounded-full">
          <a
            href="/hotels"
            className={`hover:text-sky-400 relative flex items-center justify-center w-12 h-12 ${window.location.pathname === "/hotels" ? " rounded-xl" : ""}`}
            title="Home"
          >
            <Home size={22} />
            {window.location.pathname === "/hotels" && (
              <span className="absolute bottom-1 left-3 w-1/2 h-1.5 bg-sky-400 rounded-xl mx-auto"></span>
            )}
          </a>
          <a
            href="/bookings"
            className={`hover:text-sky-400 relative flex items-center justify-center w-12 h-12 ${window.location.pathname === "/bookings" ? "rounded-xl" : ""}`}
            title="Bookings"
          >
            <CalendarCheck2 size={22} />
            {window.location.pathname === "/bookings" && (
              <span className="absolute bottom-1 left-3 w-1/2 h-1.5 bg-sky-400 rounded-xl mx-auto"></span>
            )}
          </a>
          <a
            href="/profile"
            className={`hover:text-sky-400 relative flex items-center justify-center w-12 h-12 ${window.location.pathname === "/profile" ? "rounded-xl" : ""}`}
            title="Profile"
          >
            <User size={22} />
            {window.location.pathname === "/profile" && (
              <span className="absolute bottom-1 left-3 w-1/2 h-1.5 bg-sky-400 rounded-xl mx-auto"></span>
            )}
          </a>
        </nav>
      </aside>
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-slate-900 text-white shadow-t z-40 flex justify-around items-center geist-mono">
        <a href="/hotels" className={`hover:text-sky-400 relative flex flex-col items-center justify-center w-16 h-16 ${window.location.pathname === "/hotels" ? "rounded-xl" : ""}`} title="Home">
          <Home size={26} />
          {window.location.pathname === "/hotels" && (
            <span className="absolute bottom-2 left-4 w-1/2 h-1.5 bg-sky-400 rounded-xl mx-auto"></span>
          )}
        </a>
        <a href="/bookings" className={`hover:text-sky-400 relative flex flex-col items-center justify-center w-16 h-16 ${window.location.pathname === "/bookings" ? "rounded-xl" : ""}`} title="Bookings">
          <CalendarCheck2 size={26} />
          {window.location.pathname === "/bookings" && (
            <span className="absolute bottom-2 left-4 w-1/2 h-1.5 bg-sky-400 rounded-xl mx-auto"></span>
          )}
        </a>
        <a href="/profile" className={`hover:text-sky-400 relative flex flex-col items-center justify-center w-16 h-16 ${window.location.pathname === "/profile" ? "rounded-xl" : ""}`} title="Profile">
          <User size={26} />
          {window.location.pathname === "/profile" && (
            <span className="absolute bottom-2 left-4 w-1/2 h-1.5 bg-sky-400 rounded-xl mx-auto"></span>
          )}
        </a>
      </nav>
    </>
  );
}

export default Sidebar;
