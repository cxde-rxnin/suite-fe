import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import HotelCard from '../components/HotelCard';
import { LoaderCircle } from 'lucide-react';
import Header from '../components/Header';

function HomePage() {
  const { hotels, isLoading, fetchHotels } = useAppStore();

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <div className='container mx-auto p-4 flex flex-col items-center'>
      <Header/>
      <h1 className="text-3xl font-bold mb-6 text-sky-400">Find Your Next Stay</h1>
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
  );
}

export default HomePage;