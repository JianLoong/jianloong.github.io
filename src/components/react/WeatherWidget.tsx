import React, { useState, useEffect } from 'react';

interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Melbourne coordinates
        const lat = -37.8136;
        const lon = 144.9631;
        
        // Using Open-Meteo API (completely free, no API key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data: WeatherData = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Weather code mapping for Open-Meteo
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'foggy',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      71: 'slight snow',
      73: 'moderate snow',
      75: 'heavy snow',
      77: 'snow grains',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with slight hail',
      99: 'thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'unknown';
  };

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
        Loading weather...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-muted-foreground">
        Weather data unavailable
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const weatherCondition = getWeatherDescription(weather.current.weather_code);
  const temperature = Math.round(weather.current.temperature_2m);
  
  // Determine if it's raining based on weather code
  const isRaining = weather.current.weather_code >= 51 && weather.current.weather_code <= 82;

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">
        It is currently {isRaining ? 'raining' : weatherCondition} in Melbourne right now
      </span>
      <span className="text-accent font-medium">
        ({temperature}°C)
      </span>
    </div>
  );
};

export default WeatherWidget; 