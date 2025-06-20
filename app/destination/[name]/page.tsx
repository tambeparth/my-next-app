import AttractionCard from '@/components/AttractionCard';
import { destinationsData } from '@/data/destinations';

export default function DestinationPage({ params }: { params: { name: string } }) {
  const destination = params.name.toLowerCase();
  const destinationInfo = destinationsData[destination as keyof typeof destinationsData];

  if (!destinationInfo) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{destination}</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Popular Attractions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationInfo.attractions.map((attraction) => (
            <AttractionCard
              key={attraction.name}
              {...attraction}
              rating={attraction.rating || 0}
              bestTime={attraction.bestTime || "Any time"}
              tips={attraction.tips || "No specific tips available"}
              cityName={destination}
            />
          ))}
        </div>
      </section>
    </div>
  );
}




