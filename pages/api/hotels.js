import axios from 'axios';

export default async function handler(req, res) {
  const { destination } = req.query;
  
  if (!destination) {
    return res.status(400).json({ error: 'Destination parameter is required' });
  }
  
  try {
    // Step 1: Get destination ID
    const destinationResponse = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
      params: { query: destination },
      headers: {
        'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    });
    
    if (!destinationResponse.data?.data || destinationResponse.data.data.length === 0) {
      return res.status(404).json({ error: `No destinations found for "${destination}"` });
    }
    
    const destId = destinationResponse.data.data[0].dest_id;
    
    // Step 2: Search for hotels
    const hotelsResponse = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/search', {
      params: {
        destination_id: destId,
        checkin: '2024-09-27',
        checkout: '2024-09-28',
        adults: 2,
        room_qty: 1,
        currency_code: 'USD'
      },
      headers: {
        'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    });
    
    if (!hotelsResponse.data?.data || hotelsResponse.data.data.length === 0) {
      return res.status(404).json({ error: 'No hotels found for this destination' });
    }
    
    return res.status(200).json({
      destination: destinationResponse.data,
      hotels: hotelsResponse.data
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error.message || 'An error occurred while fetching hotel data',
      details: error.response?.data || {}
    });
  }
}
