'use client';

import { useState } from 'react';
import { searchDestination } from '@/services/hotelApi';

export default function HotelSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchDestination(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hotel Destination Search</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a city or location..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>
          {results.data && results.data.length > 0 ? (
            <ul className="divide-y">
              {results.data.map((item: any) => (
                <li key={item.dest_id} className="py-2">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-600">
                    {item.city_name}, {item.country}
                  </p>
                  <p className="text-xs text-gray-500">ID: {item.dest_id}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>API Key: {process.env.NEXT_PUBLIC_HOTEL_API_KEY ? '✅ Set' : '❌ Not set'}</p>
        <p>API Host: {process.env.NEXT_PUBLIC_HOTEL_API_HOST ? '✅ Set' : '❌ Not set'}</p>
      </div>
    </div>
  );
}
