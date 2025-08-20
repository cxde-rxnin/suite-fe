import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import HotelCard from '../components/HotelCard';
import { LoaderCircle } from 'lucide-react';
import Header from '../components/Header';

function HotelsPage() {
  const { hotels, isLoading, fetchHotels } = useAppStore();

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <div className="flex flex-col min-h-screen md:pl-20">
        <Header />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-sky-400">Hotels</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin h-12 w-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(hotel => (
              <HotelCard key={hotel.objectId} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelsPage;
