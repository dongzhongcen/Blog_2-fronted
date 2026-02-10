import { useGitHubContributions, groupContributionsByWeek, getContributionColor } from '@/hooks/useGitHubContributions';
import { Card } from '@/components/ui/card';
import { Loader2, Github, Flame, GitCommit, TrendingUp, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface GitHubCardProps {
  username?: string;
}

export function GitHubCard({ username = 'github-user' }: GitHubCardProps) {
  const { contributions, loading, error, stats } = useGitHubContributions(username);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <Card className="glass-card p-4 flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card p-4 flex items-center justify-center h-48">
        <p className="text-sm text-gray-500">无法获取数据</p>
      </Card>
    );
  }

  const weeks = groupContributionsByWeek(contributions);

  return (
    <Card className="glass-card overflow-hidden gradient-border">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-gray-300" />
            <span className="font-semibold text-white">GitHub</span>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            @{username}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <GitCommit className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
            <div className="text-lg font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-500">贡献</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-4 h-4 mx-auto mb-1 text-orange-400" />
            <div className="text-lg font-bold text-white">{stats.streak}</div>
            <div className="text-xs text-gray-500">连续</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <div className="text-lg font-bold text-white">{stats.maxDay}</div>
            <div className="text-xs text-gray-500">最高</div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-max">
            <div className="flex gap-1">
              {weeks.slice(-20).map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-2.5 h-2.5 rounded-sm transition-all hover:scale-125 ${
                        day ? getContributionColor(day.level, isDark) : 'bg-transparent'
                      }`}
                      title={day ? `${day.date}: ${day.count} 次贡献` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-xs text-gray-600">少</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-2.5 h-2.5 rounded-sm ${getContributionColor(level, isDark)}`}
                />
              ))}
              <span className="text-xs text-gray-600">多</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
