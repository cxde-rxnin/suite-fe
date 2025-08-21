import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import HotelsPage from './HotelsPage';
import BookingsPage from './BookingsPage';
import ProfilePage from './ProfilePage';
import HotelDetailsPage from './HotelDetailsPage';

const UserDashboard = () => {
  const location = useLocation();

  // Determine which component to show based on the current path
  const getCurrentComponent = () => {
    if (location.pathname === '/hotels') {
      return <HotelsPage />;
    } else if (location.pathname === '/hotels/bookings') {
      return <BookingsPage />;
    } else if (location.pathname === '/hotels/favorites') {
      return <ProfilePage />;
    } else if (location.pathname.match(/^\/hotels\/[^\/]+$/)) {
      // This matches /hotels/:hotelId pattern
      return <HotelDetailsPage />;
    }
    // Default to HotelsPage
    return <HotelsPage />;
  };

  return (
    <div className="flex flex-1 min-h-screen bg-slate-900">
      <div className="w-full">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="w-full flex-1 md:ml-20 mt-28 pb-40">
            {getCurrentComponent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;