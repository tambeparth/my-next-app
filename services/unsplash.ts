import axios from 'axios';

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

export async function getAttractionImage(attractionName: string, cityName: string) {
  try {
    const response = await axios.get<UnsplashResponse>('https://api.unsplash.com/search/photos', {
      params: {
        query: `${attractionName} ${cityName} landmark`,
        client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
        per_page: 1,
        orientation: 'landscape'
      }
    });

    if (response.data.results.length > 0) {
      const photo = response.data.results[0];
      return {
        url: photo.urls.regular,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      };
    }

    // Fallback to a more general search if no results found
    const fallbackResponse = await axios.get<UnsplashResponse>('https://api.unsplash.com/search/photos', {
      params: {
        query: `${attractionName} ${cityName}`,
        client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
        per_page: 1,
        orientation: 'landscape'
      }
    });

    if (fallbackResponse.data.results.length > 0) {
      const photo = fallbackResponse.data.results[0];
      return {
        url: photo.urls.regular,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      };
    }

    return {
      url: '/placeholder-image.jpg',
      photographer: '',
      photographerUrl: ''
    };
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return {
      url: '/placeholder-image.jpg',
      photographer: '',
      photographerUrl: ''
    };
  }
}