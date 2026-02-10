import { useState, useEffect } from 'react';
import type { WeatherData } from '@/types';

// Mock weather data
const mockWeatherData: WeatherData = {
  city: '北京',
  temperature: 22,
  condition: '晴朗',
  humidity: 45,
  windSpeed: 12,
  icon: 'sun',
};

const weatherConditions = [
  { condition: '晴朗', icon: 'sun' },
  { condition: '多云', icon: 'cloud' },
  { condition: '阴天', icon: 'cloud-overcast' },
  { condition: '小雨', icon: 'rain' },
  { condition: '雷阵雨', icon: 'thunder' },
];

export function useWeather(city?: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // Try to get user's location
        if (navigator.geolocation && !city) {
          navigator.geolocation.getCurrentPosition(
            async () => {
              // In production, you would call a weather API here
              // const { latitude, longitude } = position.coords;
              // const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${latitude},${longitude}`);
              
              // Simulate API delay
              await new Promise((resolve) => setTimeout(resolve, 500));
              
              // Generate slightly random weather data
              const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
              const randomTemp = Math.floor(Math.random() * 20) + 10; // 10-30°C
              
              setWeather({
                ...mockWeatherData,
                temperature: randomTemp,
                condition: randomCondition.condition,
                icon: randomCondition.icon,
              });
              setError(null);
              setLoading(false);
            },
            async () => {
              // Fallback to default city
              await new Promise((resolve) => setTimeout(resolve, 500));
              setWeather(mockWeatherData);
              setLoading(false);
            }
          );
        } else {
          // Use provided city or default
          await new Promise((resolve) => setTimeout(resolve, 500));
          setWeather({
            ...mockWeatherData,
            city: city || mockWeatherData.city,
          });
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  return { weather, loading, error };
}

export function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    '晴朗': '☀️',
    '多云': '⛅',
    '阴天': '☁️',
    '小雨': '🌧️',
    '中雨': '🌧️',
    '大雨': '⛈️',
    '雷阵雨': '⛈️',
    '雪': '🌨️',
    '雾': '🌫️',
  };
  return iconMap[condition] || '🌡️';
}
