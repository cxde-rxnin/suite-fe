import HotelProfile from './pages/HotelProfile';
import HotelBookings from './pages/HotelBookings';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider, createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SidebarWrapper from './SidebarWrapper';
import LandingPage from './pages/LandingPage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage';
import HotelDashboard from './pages/HotelDashboard';
import HotelHome from './pages/HotelHome';
import Hotel from './pages/Hotel';
import HotelRedirect from './pages/HotelRedirect';
import HotelRegisterInline from './pages/HotelRegisterInline';
import UserDashboard from './pages/UserDashboard';
import HotelRooms from './pages/HotelRooms';

// Configure the network (mainnet, testnet, devnet, or localnet)
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Router>
            <div className="bg-slate-900 text-white min-h-screen flex">
              {/* Only show sidebar if not on landing page */}
              <Routes>
                <Route path="/" element={<main className="flex-1"><LandingPage /></main>} />
                {/* User Routes - All under UserDashboard */}
                <Route path="/hotels" element={<><SidebarWrapper /><div className="flex-1 flex flex-col min-h-screen"><UserDashboard /></div></>} />
                <Route path="/hotels/bookings" element={<><SidebarWrapper /><div className="flex-1 flex flex-col min-h-screen"><UserDashboard /></div></>} />
                <Route path="/hotels/favorites" element={<><SidebarWrapper /><div className="flex-1 flex flex-col min-h-screen"><UserDashboard /></div></>} />
                <Route path="/hotels/:hotelId" element={<><SidebarWrapper /><div className="flex-1 flex flex-col min-h-screen"><UserDashboard /></div></>} />
                <Route path="/hotels/:hotelId/rooms/:roomId" element={<RoomDetailsPage />} />
                <Route path="/hotels/:hotelId/rooms/:roomId/book" element={<BookingPage />} />
                {/* Hotel Owner Routes */}
                <Route path="/hotel" element={<HotelRedirect />} />
                <Route path="/hotel/:hotelId" element={<HotelDashboard />}> 
                  <Route index element={<HotelHome />} />
                  <Route path="bookings" element={<HotelBookings />} />
                  <Route path="rooms" element={<HotelRooms />} />
                  <Route path="profile" element={<HotelProfile />} />
                </Route>
                <Route path="/hotel/register" element={<HotelRegisterInline />} />
              </Routes>
              <ToastContainer theme="dark" position="bottom-right" />
            </div>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;