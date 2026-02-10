import { useGitHubContributions, groupContributionsByWeek, getContributionColor } from '@/hooks/useGitHubContributions';
import { Card } from '@/components/ui/card';
import { Loader2, Github, Flame, GitCommit, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface GitHubContributionsProps {
  username?: string;
}

export function GitHubContributions({ username = 'github-user' }: GitHubContributionsProps) {
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
        <p className="text-sm text-gray-500">无法获取贡献数据</p>
      </Card>
    );
  }

  const weeks = groupContributionsByWeek(contributions);
  const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <Card className="glass-card overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="font-semibold text-gray-900 dark:text-white">
              GitHub 贡献
            </span>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            @{username}
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <GitCommit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs text-gray-500">总贡献</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.streak}
            </div>
            <div className="text-xs text-gray-500">连续天数</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.maxDay}
            </div>
            <div className="text-xs text-gray-500">单日最高</div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Month Labels */}
            <div className="flex gap-1 mb-1">
              <div className="w-8" />
              {monthLabels.map((month, i) => (
                <div key={i} className="flex-1 text-xs text-gray-500 text-center">
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="flex gap-1">
              {/* Day Labels */}
              <div className="flex flex-col gap-1 w-8">
                <span className="text-xs text-gray-500 h-3">一</span>
                <span className="text-xs text-gray-500 h-3">三</span>
                <span className="text-xs text-gray-500 h-3">五</span>
              </div>

              {/* Grid */}
              <div className="flex gap-1">
                {weeks.slice(-52).map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${
                          day ? getContributionColor(day.level, isDark) : 'bg-transparent'
                        }`}
                        title={day ? `${day.date}: ${day.count} 次贡献` : ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-2">
              <span className="text-xs text-gray-500">少</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getContributionColor(level, isDark)}`}
                />
              ))}
              <span className="text-xs text-gray-500">多</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
