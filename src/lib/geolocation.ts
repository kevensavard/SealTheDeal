import axios from 'axios';

export async function getLocationFromIP(request: Request): Promise<string> {
  try {
    // Get client IP from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIP || '127.0.0.1';

    // Skip geolocation for localhost
    if (clientIP === '127.0.0.1' || clientIP === '::1' || clientIP.startsWith('192.168.') || clientIP.startsWith('10.')) {
      return 'Local Network';
    }

    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await axios.get(`https://ipapi.co/${clientIP}/json/`, {
      timeout: 5000, // 5 second timeout
    });

    const { city, region, country_name } = response.data;
    
    if (city && region && country_name) {
      return `${city}, ${region}, ${country_name}`;
    } else if (city && country_name) {
      return `${city}, ${country_name}`;
    } else if (country_name) {
      return country_name;
    } else {
      return 'Unknown Location';
    }
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return 'Digital Signature';
  }
}
