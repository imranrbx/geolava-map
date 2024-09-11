import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// import MapContainer from '@/map/MapContainer'

const MapContainer = dynamic(() => import('@/map/MapContainer'), { ssr: false });

export const metadata: Metadata = {
  title: 'GeoLava 🌋',
  description: 'App for map search',
};

function HomePage() {
  return (
    <div className="h-screen w-screen relative">
      <MapContainer />
    </div>
  );
}

export default HomePage;
