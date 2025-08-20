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
                <Route path="/hotels" element={<><SidebarWrapper /><div className="flex-1 flex flex-col min-h-screen"><HotelsPage /></div></>} />
                <Route path="/hotels/:objectId" element={<div className="flex-1 flex flex-col min-h-screen"><HotelDetailsPage /></div>} />
                <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
                <Route path="/hotel/:hotelId/rooms/:roomId" element={<RoomDetailsPage />} />
                <Route path="/hotel/:hotelId/rooms/:roomId/book" element={<BookingPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
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