import { useWeather, getWeatherIcon } from '@/hooks/useWeather';
import { Card } from '@/components/ui/card';
import { Loader2, Droplets, Wind, MapPin } from 'lucide-react';

interface WeatherCardProps {
  city?: string;
}

export function WeatherCard({ city }: WeatherCardProps) {
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
        <p className="text-sm text-gray-500">无法获取天气</p>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden gradient-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-gray-300">
              {weather.city}
            </span>
          </div>
          <span className="text-xs text-gray-500">LIVE</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{getWeatherIcon(weather.condition)}</span>
            <div>
              <div className="text-3xl font-bold text-white">
                {weather.temperature}°
              </div>
              <div className="text-sm text-emerald-400">
                {weather.condition}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500">湿度</div>
              <div className="text-sm font-medium text-white">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
              <Wind className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500">风速</div>
              <div className="text-sm font-medium text-white">{weather.windSpeed}km/h</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
