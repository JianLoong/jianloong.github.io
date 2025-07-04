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

  // Map weather codes to SVG icons
  const getWeatherIcon = (code: number, isDay: number): React.ReactElement => {
    // Simple SVGs for main weather types
    // You can further customize or add more icons as needed
    switch (code) {
      case 0: // Clear
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Clear sky" className="inline align-middle"><circle cx="10" cy="10" r="6" fill="#FFD600" /></svg>
        );
      case 1: // Mainly clear
      case 2: // Partly cloudy
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Partly cloudy" className="inline align-middle"><circle cx="8" cy="10" r="5" fill="#FFD600" /><ellipse cx="13" cy="13" rx="5" ry="3" fill="#B0BEC5" /></svg>
        );
      case 3: // Overcast
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Overcast" className="inline align-middle"><ellipse cx="10" cy="13" rx="7" ry="4" fill="#B0BEC5" /></svg>
        );
      case 45: // Fog
      case 48:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Fog" className="inline align-middle"><ellipse cx="10" cy="14" rx="7" ry="3" fill="#CFD8DC" /><rect x="4" y="10" width="12" height="2" fill="#B0BEC5" /></svg>
        );
      case 51: case 53: case 55: // Drizzle
      case 61: case 63: case 65: // Rain
      case 80: case 81: case 82: // Showers
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Rain" className="inline align-middle"><ellipse cx="10" cy="10" rx="6" ry="3" fill="#B0BEC5" /><line x1="7" y1="14" x2="7" y2="18" stroke="#2196F3" strokeWidth="2" /><line x1="13" y1="14" x2="13" y2="18" stroke="#2196F3" strokeWidth="2" /></svg>
        );
      case 71: case 73: case 75: case 77: case 85: case 86: // Snow
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Snow" className="inline align-middle"><ellipse cx="10" cy="10" rx="6" ry="3" fill="#B0BEC5" /><circle cx="7" cy="15" r="1" fill="#90CAF9" /><circle cx="13" cy="15" r="1" fill="#90CAF9" /></svg>
        );
      case 95: case 96: case 99: // Thunderstorm
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Thunderstorm" className="inline align-middle"><ellipse cx="10" cy="10" rx="6" ry="3" fill="#B0BEC5" /><polygon points="9,13 11,13 10,16" fill="#FFD600" /><polyline points="10,13 12,11 11,13" fill="none" stroke="#FFD600" strokeWidth="1.5" /></svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Unknown weather" className="inline align-middle"><circle cx="10" cy="10" r="6" fill="#B0BEC5" /></svg>
        );
    }
  };

  if (!weather) {
    return null;
  }

  const weatherCondition = getWeatherDescription(weather.current.weather_code);
  const temperature = Math.round(weather.current.temperature_2m);
  const isRaining = weather.current.weather_code >= 51 && weather.current.weather_code <= 82;
  const icon = getWeatherIcon(weather.current.weather_code, weather.current.is_day);

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      {icon}
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