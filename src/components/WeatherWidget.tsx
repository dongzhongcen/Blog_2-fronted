import { useWeather, getWeatherIcon } from '@/hooks/useWeather';
import { Card } from '@/components/ui/card';
import { Loader2, Droplets, Wind, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  city?: string;
}

export function WeatherWidget({ city }: WeatherWidgetProps) {
  const { weather, loading, error } = useWeather(city);

  if (loading) {
    return (
      <Card className="glass-card p-4 flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="glass-card p-4 flex items-center justify-center h-32">
        <p className="text-sm text-gray-500">无法获取天气信息</p>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {weather.city}
            </span>
          </div>
          <span className="text-xs text-gray-500">实时天气</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getWeatherIcon(weather.condition)}</span>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {weather.condition}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              湿度 {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              风速 {weather.windSpeed}km/h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
